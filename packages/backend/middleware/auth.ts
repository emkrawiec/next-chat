import { Socket } from 'socket.io';
import Express from 'express';

export const httpAuthCheckMiddleware = (
  req: Express.Request,
  res: Express.Response,
  next: Express.NextFunction
) => {
  if (req.isAuthenticated()) {
    next();
  } else {
    return res.status(401).send();
  }
};

export const wsAuthCheckMiddleware = (socket: Socket, next) => {
  if (socket.request.user) {
    next();
  } else {
    next(new Error('unauthorized'));
  }
};
