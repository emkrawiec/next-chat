import Express from 'express';
import { z } from 'zod';

export const validatorMiddlewareFactory =
  (schema: z.ZodType<any>) =>
  (req: Express.Request, res: Express.Response, next: Express.NextFunction) => {
    try {
      schema.parse(req.body);
      next();
    } catch (err: unknown) {
      return res.status(400).send();
    }
  };
