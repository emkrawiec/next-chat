import { prisma } from './../../prisma/init';
import Stripe from "stripe";
import { stripe } from "./setup";
import {
  CreateCheckoutSessionDTO,
  CreatePaymentGatewayCustomerDTO,
  FulFilledPaymentDTO,
  PaymentDTO,
  PaymentGatewayCheckoutSessionDTO,
  PaymentIntentDTO,
} from "../../dto/payment-dto";
import { editUserProfile } from "../user";
import { getUserByID } from '../auth';
import { getFeatureByID } from '../feature';
import { getPriceByID } from "../price";
import { paymentEventEmitter } from '../../event/payment';

const resolvePaymentGatewayPaymentIntentId = (maybePaymentIntent: Awaited<ReturnType<typeof stripe.checkout.sessions.create>>['payment_intent']) => {
  if (maybePaymentIntent) {
    return maybePaymentIntent.toString();
  } else {
    return null;
  }
}

const resolvePaymentGatewayCustomerIdFromInvoice = (paymentGatewayInvoice: Stripe.Invoice) => {
  const maybePaymentGatewayPaymentCustomer = paymentGatewayInvoice.customer;

  if (maybePaymentGatewayPaymentCustomer) {
    return maybePaymentGatewayPaymentCustomer.toString();
  } else {
    return null;
  }
}

const resolvePaymentGatewayPaymentIntentIdFromInvoice = (paymentGatewayInvoice: Stripe.Invoice) => {
  const maybePaymentGatewayPaymentIntent = paymentGatewayInvoice.payment_intent;

  if (maybePaymentGatewayPaymentIntent) {
    return maybePaymentGatewayPaymentIntent.toString();
  } else {
    return null;
  }
}

const getFulfilledPaymentDtoFromPaymentGatewayInvoice = (paymentGatewayInvoice: Stripe.Invoice): FulFilledPaymentDTO => {
  const [paymentGatewayPaymentIntentId, paymentGatewayCustomerId] = [
    resolvePaymentGatewayPaymentIntentIdFromInvoice(paymentGatewayInvoice),
    resolvePaymentGatewayCustomerIdFromInvoice(paymentGatewayInvoice),
  ];

  if (!paymentGatewayPaymentIntentId || !paymentGatewayCustomerId) {
    throw new Error();
  }
  
  return {
    paymentGatewayCustomerId,
    paymentGatewayPaymentIntentId
  }
}

const fullfillPayment = async (dto: FulFilledPaymentDTO) => {
  const { paymentGatewayPaymentIntentId } = dto;

  try {
    const paymentIntent = await prisma.paymentIntent.update({
      where: {
        paymentGatewayPaymentIntentId
      },
      data: {
        paymentStatus: 'SUCCESS'
      }
    });
    
    if (!paymentIntent) {
      throw new Error();
    }
  
    paymentEventEmitter.emit('payment_fulfilled', {
      paymentIntentId: paymentIntent.ID
    });
  } catch (err) {
    console.error(err);
  }
}

const createPaymentIntent = async (paymentIntentDto: PaymentIntentDTO) => {
  const { featureId, userId, paymentGatewayPaymentIntentId } = paymentIntentDto;

  await prisma.paymentIntent.create({
    data: {
      userId,
      featureId,
      paymentGatewayPaymentIntentId,
      paymentStatus: 'PENDING'
    }
  });
}

export const createPaymentGatewayCustomer = async (
  dto: CreatePaymentGatewayCustomerDTO
) => {
  const { email } = dto;

  const newCustomerParams: Stripe.CustomerCreateParams = {
    email,
  };

  const stripeCustomer = await stripe.customers.create(newCustomerParams);

  return stripeCustomer.id;
};

export const preparePayment = async (dto: PaymentDTO) => {
  const { featureId, priceId, userId } = dto;

  const [feature, price, user] = await Promise.all([
    getFeatureByID(featureId),
    getPriceByID(priceId),
    getUserByID(userId)
  ]);

  if (!feature || !user || !price) {
    throw new Error("");
  }

  let paymentGatewayCustomerID = user.paymentGatewayCustomerID;

  if (!paymentGatewayCustomerID) {
    const newPaymentGatewayCustomerId = await createPaymentGatewayCustomer({
      email: user.email,
    });

    await editUserProfile({
      userId,
      paymentGatewayCustomerID: newPaymentGatewayCustomerId,
    });

    paymentGatewayCustomerID = newPaymentGatewayCustomerId;
  }

  const paymentGatewayCheckoutSessionDTO =
    await createPaymentGatewayCheckoutSession({
      paymentGatewayCustomerID,
      paymentGatewayPriceID: price.priceId,
    });

  await createPaymentIntent({
    featureId,
    paymentGatewayPaymentIntentId: paymentGatewayCheckoutSessionDTO.paymentGatewayPaymentIntentId,
    userId
  });

  return paymentGatewayCheckoutSessionDTO;
};

export const createPaymentGatewayCheckoutSession = async (
  dto: CreateCheckoutSessionDTO
): Promise<PaymentGatewayCheckoutSessionDTO> => {
  const {
    paymentGatewayCustomerID,
    paymentGatewayPriceID,
    quantity = 1
  } = dto;

  const checkoutSession = await stripe.checkout.sessions.create({
    line_items: [
      {
        price: paymentGatewayPriceID,
        quantity
      },
    ],
    customer: paymentGatewayCustomerID,
    mode: 'payment',
    success_url: "http://localhost:3000/payment-success/",
    cancel_url: "http://localhost:3000/payment-cancel/",
  });

  const paymentGatewayPaymentIntentId = resolvePaymentGatewayPaymentIntentId(checkoutSession.payment_intent);

  if (!paymentGatewayPaymentIntentId) {
    throw new Error();
  }

  return {
    sessionId: checkoutSession.id,
    paymentGatewayPaymentIntentId
  };
};

const getWebhookEvent = ({ payload, signature }) => {
  try {
    const event = stripe.webhooks.constructEvent(payload, signature, process.env.STRIPE_WEBHOOK_SIGNING_SECRET);
    return event;
  } catch (err) {
    // console.log(payload);
    console.error('errored');
    throw Error();
  }
}

export const handlePaymentStatus = ({ payload, signature }) => {
  const webhookEvent = getWebhookEvent({ payload, signature });

  switch (webhookEvent.type) {
    case 'checkout.session.completed': {
      const fulfilledPaymentDto = getFulfilledPaymentDtoFromPaymentGatewayInvoice(webhookEvent.data.object as Stripe.Invoice);

      fullfillPayment(fulfilledPaymentDto);
      break;
    }
    default: {
      // Unexpected webhook event type
      return;
    }
  }
}