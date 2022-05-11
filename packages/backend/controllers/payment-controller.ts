import Express from 'express';
import {
  EmptyObject,
  APIPaymentPayload,
  APICreatePaymentIntentResponsePayload,
} from '@next-chat/types';
//
import { preparePayment, handlePaymentStatus } from '../services/payment';
import { PaymentDTO } from '../dto/payment-dto';

export const createPaymentAction = async (
  req: Express.Request<EmptyObject, EmptyObject, APIPaymentPayload>,
  res: Express.Response<APICreatePaymentIntentResponsePayload>
) => {
  const { featureId, priceId } = req.body;
  const userId = req.user!.ID;

  const dto: PaymentDTO = {
    featureId,
    priceId,
    userId,
  };

  try {
    const checkoutSession = await preparePayment(dto);

    res.status(200).json({
      checkoutSessionId: checkoutSession.sessionId,
    });
  } catch (err: unknown) {
    res.status(500).send();
  }
};

// Webhook handler.
export const handlePaymentStatusAction = async (
  req: Express.Request,
  res: Express.Response
) => {
  const payload = req.body;
  const signature = req.headers['stripe-signature'];

  try {
    handlePaymentStatus({
      signature,
      payload,
    });

    res.status(200).send();
  } catch (err: unknown) {
    res.status(400).send();
  }
};
