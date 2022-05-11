import { createServer } from 'http';
import Express from 'express';
import cors from 'cors';
import morgan from 'morgan';
//
import { sessionMiddleware } from './common';
import { initAuthForHttp } from '../services/auth';
import { logger } from '../services/log/logger';
import { initPaymentWebhookRoute } from '../services/payment/init';
import { initUploadsAvatarStaticRoute } from '../services/user/init';

type ExpressApp = ReturnType<typeof Express>;
const createApp = () => Express();

const app = createApp();
const httpServer = createServer(app);
const startApp = () =>
  httpServer.listen(3001, () => {
    logger.log('info', 'App started on port 3001.');
  });

const initCatchAllRoute: ExpressMiddlewareInitializer = (app) =>
  app.all('*', (req: Express.Request, res: Express.Response) =>
    res.status(404).send()
  );

const initVendorMiddlewares: ExpressMiddlewareInitializer = (app) => {
  app.use(morgan('common'));
  app.use(Express.json());
  app.use(
    cors({
      origin: process.env.FRONTEND_URL,
      credentials: true,
    })
  );
  app.use(sessionMiddleware);
};

// Special middleware for Stripe at the beggining to avoid collision with app.use(Express.json());
initPaymentWebhookRoute(app);
//
initVendorMiddlewares(app);
//
initAuthForHttp(app);
//
initUploadsAvatarStaticRoute(app);
//
// initCatchAllRoute(app);

export type ExpressMiddlewareInitializer = (app: ExpressApp) => void;
export { app, httpServer, startApp };
