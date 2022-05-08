import 'dotenv/config';
import { app, httpServer, startApp } from './core/server';
import { initAuth } from './services/auth'
import { initWS } from './core/websocket'; 
import { getRoomRouter } from './router/room-router';
import { getAuthRouter } from './router/auth-router';
import { getUserRouter } from './router/user-router';
import { getPaymentRouter } from './router/payment-router';

const initControllers = () => {
  app.use(getRoomRouter());
  app.use(getAuthRouter());
  app.use(getUserRouter());
  app.use(getPaymentRouter());
}

startApp();
initAuth();
initWS(httpServer);
initControllers();