import express from "express";
import passport from "passport";
//
import {
  registerAction,
  afterLoginAction,
  validateRegisterActionPayloadMiddleware,
  forgotPasswordAction,
  passwordRecoveryAction,
  checkPasswordRecoveryToken,
  getUserProfileAction,
  logoutAction
} from "../controllers/auth-controller";

export const getAuthRouter = () => {
  const authRouter = express.Router();

  authRouter.post(
    "/signup",
    validateRegisterActionPayloadMiddleware,
    registerAction
  );
  authRouter.post(
    "/login",
    passport.authenticate("local", {
      failureFlash: true,
    }),
    afterLoginAction
  );
  authRouter.get("/logout", logoutAction);
  authRouter.post("/forgot", forgotPasswordAction);
  authRouter.post("/check-recovery-token", checkPasswordRecoveryToken);
  authRouter.post("/pass-recovery", passwordRecoveryAction);
  authRouter.get("/user", getUserProfileAction);

  return authRouter;
};
