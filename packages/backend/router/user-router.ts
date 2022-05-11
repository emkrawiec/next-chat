import express from 'express';
//
import {
  getUsersAction,
  editUserProfileAction,
} from '../controllers/user-controller';
import { httpAuthCheckMiddleware } from '../middleware/auth';
import { userAvatarUploadMiddleware } from '../services/user';

export const getUserRouter = () => {
  const userRouter = express.Router();

  userRouter.get('/users', httpAuthCheckMiddleware, getUsersAction);
  userRouter.post(
    '/profile',
    httpAuthCheckMiddleware,
    userAvatarUploadMiddleware.single('avatar'),
    editUserProfileAction
  );

  return userRouter;
};
