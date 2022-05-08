import express from "express";
//
import { createPaymentAction, handlePaymentStatusAction } from "../controllers/payment-controller";
import { httpAuthCheckMiddleware } from "../middleware/auth";

export const getPaymentRouter = () => {
  const paymentRouter = express.Router();

  paymentRouter.post("/payment/create", httpAuthCheckMiddleware, createPaymentAction);
  paymentRouter.post('/payment/webhook', express.raw({ type: 'application/json'}), handlePaymentStatusAction);

  return paymentRouter;
};