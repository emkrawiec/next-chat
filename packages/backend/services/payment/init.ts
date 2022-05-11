import Express from 'express';
import { ExpressMiddlewareInitializer } from '../../core/server';

// According to Stripe docs. https://stripe.com/docs/payments/checkout/fulfill-orders
export const initPaymentWebhookRoute: ExpressMiddlewareInitializer = (app) => {
  app.use('/payment/webhook', Express.raw({ type: '*/*' }));
};
