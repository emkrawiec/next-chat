import { UserSignupPayload, UserLoginPayload } from './../dto/auth-dto';
import express from 'express';
import passport from 'passport';
//
import {
  registerAction,
  afterLoginAction,
  forgotPasswordAction,
  passwordRecoveryAction,
  checkPasswordRecoveryToken,
  getUserProfileAction,
  logoutAction,
} from '../controllers/auth-controller';
import { validatorMiddlewareFactory } from '../middleware/validator';

export const getAuthRouter = () => {
  const authRouter = express.Router();

  authRouter.post(
    '/signup',
    validatorMiddlewareFactory(UserSignupPayload),
    registerAction
  );
  authRouter.post(
    '/login',
    validatorMiddlewareFactory(UserLoginPayload),
    passport.authenticate('local', {
      failureFlash: true,
    }),
    afterLoginAction
  );
  authRouter.get('/logout', logoutAction);
  authRouter.post('/forgot', forgotPasswordAction);
  authRouter.post('/check-recovery-token', checkPasswordRecoveryToken);
  authRouter.post('/pass-recovery', passwordRecoveryAction);
  authRouter.get('/user', getUserProfileAction);

  return authRouter;
};
