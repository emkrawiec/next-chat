import Express from 'express';
//
import { CONFIG } from '../../config';
import { ExpressMiddlewareInitializer } from '../../core/server';

export const initUploadsAvatarStaticRoute: ExpressMiddlewareInitializer = (
  app
) => {
  app.use('/uploads/avatar', Express.static(CONFIG.uploadsDir.avatar));
};
