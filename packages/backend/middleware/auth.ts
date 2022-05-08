import { NextFunction, Request, Response } from 'express';

export const httpAuthCheckMiddleware = (req: Request, res: Response, next: NextFunction) => {
  if (req.isAuthenticated()) {
    next();
  } else {
    return res.status(401).send();
  }
}

export const wsAuthCheckMiddleware = (socket, next) => {
  if (socket.request.user) {
    next();
  } else {
    next(new Error('unauthorized'))
  }
}