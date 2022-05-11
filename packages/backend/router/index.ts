import { ExpressMiddlewareInitializer } from '../core/server';
import { getRoomRouter } from './room-router';
import { getAuthRouter } from './auth-router';
import { getUserRouter } from './user-router';
import { getPaymentRouter } from './payment-router';

export const initAppRoutes: ExpressMiddlewareInitializer = (app) => {
  app.use(getRoomRouter());
  app.use(getAuthRouter());
  app.use(getUserRouter());
  app.use(getPaymentRouter());
};
