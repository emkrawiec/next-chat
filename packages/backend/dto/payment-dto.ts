import { z, ZodLazy } from 'zod';

const CreatePaymentGatewayCustomerDTO = z.object({
  email: z.string(),
});

const CreatePaymentCheckoutSessionDTO = z.object({
  paymentGatewayPriceID: z.string(),
  paymentGatewayCustomerID: z.string(),
  quantity: z.number().optional(),
});

const PaymentGatewayCheckoutSessionDTO = z.object({
  sessionId: z.string(),
  paymentGatewayPaymentIntentId: z.string(),
});

const PaymentPayload = z.object({
  featureId: z.number(),
  priceId: z.number(),
});

const PaymentDTO = z.object({
  userId: z.number(),
  featureId: z.number(),
  priceId: z.number(),
});

const PaymentIntentDTO = z.object({
  userId: z.number(),
  featureId: z.number(),
  paymentGatewayPaymentIntentId: z.string(),
});

const FulFilledPaymentDTO = z.object({
  paymentGatewayCustomerId: z.string(),
  paymentGatewayPaymentIntentId: z.string(),
});

export type PaymentDTO = z.infer<typeof PaymentDTO>;
export type PaymentIntentDTO = z.infer<typeof PaymentIntentDTO>;
export type FulFilledPaymentDTO = z.infer<typeof FulFilledPaymentDTO>;
export type PaymentPayload = z.infer<typeof PaymentPayload>;

export type CreatePaymentGatewayCustomerDTO = z.infer<
  typeof CreatePaymentGatewayCustomerDTO
>;
export type CreateCheckoutSessionDTO = z.infer<
  typeof CreatePaymentCheckoutSessionDTO
>;
export type PaymentGatewayCheckoutSessionDTO = z.infer<
  typeof PaymentGatewayCheckoutSessionDTO
>;
