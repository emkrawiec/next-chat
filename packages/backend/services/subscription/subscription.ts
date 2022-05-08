import { getUserByID } from './../auth/auth';
import { SubscriptionDTO } from "../../dto/subscription-dto";
import { getFeatureByID } from "../feature/feature";
import { createPaymentGatewayCheckoutSession, createPaymentGatewayCustomer } from '../payment/payment';

export const createSubscription = async (dto: SubscriptionDTO) => {
  const { featureId, userId } = dto;

  const feature = await getFeatureByID(featureId);
  const user = await getUserByID(userId);

  if (!feature || !user || !feature.paymentGatewayPriceID) {
    throw new Error('');
  }

  let paymentGatewayCustomerID = user.paymentGatewayCustomerID;

  if (!paymentGatewayCustomerID) {
    const newPaymentGatewayCustomerId = await createPaymentGatewayCustomer({
      email: user.email
    });

    await editUserProfile({
      userId,
      paymentGatewayCustomerID: newPaymentGatewayCustomerId
    });

    paymentGatewayCustomerID = newPaymentGatewayCustomerId;
  }

  const paymentGatewayCheckoutSession = await createPaymentGatewayCheckoutSession({
    paymentGatewayCustomerID,
    transationType: 'SUBSCRIPTION',
    paymentGatewayPriceID: feature.paymentGatewayPriceID
  });

  return paymentGatewayCheckoutSession.sessionId;
}