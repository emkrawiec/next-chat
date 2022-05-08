import { Request, Response } from "express";
// 
import { preparePayment, handlePaymentStatus } from '../services/payment';
import { PayloadPayload, PaymentDTO } from '../dto/payment-dto';

export const createPaymentAction = async (
  req: Request<{}, {}, PayloadPayload>,
  res: Response
) => {
  const { featureId, priceId } = req.body;
  const userId = req.user!.ID;

  const dto: PaymentDTO = {
    featureId,
    priceId,
    userId
  }

  try {
    const checkoutSession = await preparePayment(dto);

    res.status(200).json({
      checkoutSessionId: checkoutSession.sessionId
    });
  } catch (err: unknown) {
    res.status(500).send();
  }
};

export const handlePaymentStatusAction = async (req: Request, res: Response) => {
  const payload = req.body;
  const signature = req.headers['stripe-signature'];

  try {
    handlePaymentStatus({
      signature,
      payload
    });
    
    res.status(200).send();
  } catch (err) {
    res.status(400).send();
  }
}