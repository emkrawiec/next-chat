import {
  EmptyObject,
  APIUserProfile,
  APISignupRequestPayload,
  APIPasswordRecoveryPrepareRequestPayload,
  APICheckPasswordRecoveryTokenRequestPayload,
  APIPasswordRecoveryRequestPayload,
} from '@next-chat/types';
import Express from 'express';
//
import { PasswordRecoveryDTO } from '../dto/auth-dto';
import { ClientRequestError } from '../error/ClientRequestError';
import {
  signupUser,
  processPasswordRecoveryPreparation,
  isPasswordRecoveryTokenValid,
  processPasswordRecovery,
  getUserProfile,
} from '../services/auth';
import { logger } from '../services/log';

export const registerAction = async (
  req: Express.Request<EmptyObject, EmptyObject, APISignupRequestPayload>,
  res: Express.Response<APIUserProfile>
) => {
  const { email, password } = req.body;

  try {
    const user = await signupUser({
      email,
      password,
    });

    return res.status(200).json(user);
  } catch (err: unknown) {
    if (err instanceof ClientRequestError) {
      res.status(400).send();
    } else {
      res.status(500).send();
    }
  }
};

export const forgotPasswordAction = async (
  req: Express.Request<
    EmptyObject,
    EmptyObject,
    APIPasswordRecoveryPrepareRequestPayload
  >,
  res: Express.Response
) => {
  const { email } = req.body;

  try {
    await processPasswordRecoveryPreparation(email);

    return res.status(200).send();
  } catch (err: unknown) {
    return res.status(500).send();
  }
};

export const checkPasswordRecoveryToken = async (
  req: Express.Request<
    EmptyObject,
    EmptyObject,
    APICheckPasswordRecoveryTokenRequestPayload
  >,
  res: Express.Response
) => {
  const { token } = req.body;

  try {
    const isTokenValid = await isPasswordRecoveryTokenValid(token);

    if (isTokenValid) {
      return res.status(200).send();
    } else {
      return res.status(400).send();
    }
  } catch (err: unknown) {
    return res.status(500).send();
  }
};

export const passwordRecoveryAction = async (
  req: Express.Request<
    EmptyObject,
    EmptyObject,
    APIPasswordRecoveryRequestPayload
  >,
  res: Express.Response
) => {
  const { token, newPassword } = req.body;
  const dto: PasswordRecoveryDTO = {
    token,
    newPassword,
  };

  try {
    await processPasswordRecovery(dto);

    return res.status(200).send();
  } catch (err: unknown) {
    console.log(err);
    return res.status(500).send();
  }
};

export const getUserProfileAction = async (
  req: Express.Request,
  res: Express.Response<APIUserProfile>
) => {
  const userId = req.user!.ID;

  if (!userId) {
    return res.status(401).send();
  }

  try {
    const userProfile = await getUserProfile(userId);

    if (userProfile) {
      return res.status(200).json(userProfile);
    }
  } catch (err: unknown) {
    console.log(err);
    return res.status(500).send();
  }
};

export const logoutAction = async (
  req: Express.Request,
  res: Express.Response
) => {
  req.logout();

  logger.log('info', 'User has logged out.');

  return res.status(200).send();
};

export const afterLoginAction = async (
  req: Express.Request,
  res: Express.Response
) => {
  const userId = req.user?.ID;

  if (!userId) {
    return res.status(401).send();
  }

  try {
    const userProfile = await getUserProfile(userId);

    if (userProfile) {
      return res.status(200).json(userProfile);
    } else {
      return res.status(403).json();
    }
  } catch (err: unknown) {
    console.log(err);
    return res.status(500).send();
  }
};
