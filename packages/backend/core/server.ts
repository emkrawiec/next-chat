import { createServer } from "http";
import express from "express";
import cors from 'cors';
import morgan from 'morgan';
// 
import { sessionMiddleware } from './common';
import { initAuthForHttp } from "../services/auth/index";
import { logger } from '../services/log/logger';

const createApp = () => express();

const app = createApp();
const httpServer = createServer(app);
const startApp = () => httpServer.listen(3001, () => {
  logger.log('info', 'App started on port 3001.');
});

// const initCatchAll = (app: Express) => app.all("*", (req, res, next) => res.status(404).send());

app.use('/payment/webhook', express.raw({ type: '*/*'}));
app.use(morgan('common'));
app.use(express.json());
app.use(sessionMiddleware);
app.use('/uploads/avatar', express.static('./uploads/avatar'))
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
}))
// initCatchAll(app);
initAuthForHttp(app);

export { app, httpServer, startApp };