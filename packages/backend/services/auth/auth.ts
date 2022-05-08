import { PasswordRecoveryDTO } from './../../dto/auth-dto';
import { sendPasswordRecoveryEmail } from './../mail/mail';
import { Prisma } from '@prisma/client'
import { hash, verify } from 'argon2';
import { v4 } from 'uuid';
// 
import { prisma } from '../../prisma/init';
import { User } from '.prisma/client';
import { UserRegisterData, UserLoginData } from '../../dto/auth-dto';
import { ClientRequestError } from '../../error/ClientRequestError';
import { logger } from '../log/logger';
import { sendWelcomeMail } from '../mail';

type UserProfile = Pick<User, 'ID' | 'email' | 'avatar'>

export const processUserSignup = async (userData: UserRegisterData) => {
  const maybeTakenUser = await getUserByEmail(userData.email);

  if (maybeTakenUser) {
    return signupUser(userData);
  } else {
    throw Error();
  }
}

export const signupUser = async (userData: UserRegisterData) => {
  const { email, password } = userData;
  
  try {
    const hashedPass = await hash(password);

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPass
      }
    });

    logger.log('info', `User with email ${email} has signed up.`);

    await sendWelcomeMail({
      to: email,
    });

    return user;
  } catch (err: unknown) {
    if (err instanceof Prisma.PrismaClientKnownRequestError || err instanceof Prisma.PrismaClientValidationError) {
      throw new ClientRequestError();
    } else {
      throw new Error();
    }
  }
}

const preparePasswordRecovery = async (email: User['email']) => {
  try {
    const hash = v4();

    await prisma.user.update({
      where: {
        email
      },
      data: {
        passwordRecoveryHash: hash,
        // 7 days.
        passwordRecoveryTimestamp: new Date(Date.now() + 1000 * 3600 * 24 * 7)
      }
    });

    return hash;
  } catch (err: unknown) {
    console.log(err);
    throw err;
  }
}

export const processPasswordRecoveryPreparation = async (email: User['email']) => {
  const user = await getUserByEmail(email);

  if (user) {
    const hash = await preparePasswordRecovery(email);

    await sendPasswordRecoveryEmail({
      link: `http://localhost:3000/pass-recovery?token=${hash}`,
      to: user.email,
    });
  } else {
    throw new Error();
  }
}

export const processPasswordRecovery = async (dto: PasswordRecoveryDTO) => {
  const { token, newPassword } = dto;
  const user = await getUserByPasswordRecoveryToken(token);
  const isTokenValid = Boolean(user);

  if (isTokenValid) {
    await changeUserPassword(user!.ID, newPassword);
    await clearPasswordHashAndTimestamp(user!.ID);
  } else {
    throw new Error();
  }
}

const getUserByPasswordRecoveryToken = async (token: User['passwordRecoveryHash']) => {
  try {
    const user = await prisma.user.findFirst({
      where: {
        passwordRecoveryHash: token
      }
    });
  
    if (user) {
      return user;
    }
  } catch (err: unknown) {
    if (err instanceof Prisma.PrismaClientKnownRequestError || err instanceof Prisma.PrismaClientValidationError) {
      console.log(err);
      throw new ClientRequestError();
    } else {
      throw new Error();
    }
  }
}

const changeUserPassword = async (id: User['ID'], newPassword: User['password']) => {
  try {
    const newPasswordHash = await hash(newPassword)

    await prisma.user.update({
      where: {
        ID: id
      },
      data: {
        password: newPasswordHash,
      }
    });
  } catch (err: unknown) {
    if (err instanceof Prisma.PrismaClientKnownRequestError || err instanceof Prisma.PrismaClientValidationError) {
      console.log(err);
      throw new ClientRequestError();
    } else {
      throw new Error();
    }
  }
}

const clearPasswordHashAndTimestamp = async (id: User['ID']) => {
  try {
    await prisma.user.update({
      where: {
        ID: id
      },
      data: {
        passwordRecoveryHash: null,
        passwordRecoveryTimestamp: null
      }
    });
  } catch (err: unknown) {
    if (err instanceof Prisma.PrismaClientKnownRequestError || err instanceof Prisma.PrismaClientValidationError) {
      console.log(err);
      throw new ClientRequestError();
    } else {
      throw new Error();
    }
  }
}
 
export const getUserByID = async (id: User['ID']) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        ID: id
      }
    });
  
    if (user) {
      return user;
    }
  } catch (err: unknown) {
    if (err instanceof Prisma.PrismaClientKnownRequestError || err instanceof Prisma.PrismaClientValidationError) {
      console.log(err);
      throw new ClientRequestError();
    } else {
      throw new Error();
    }
  }
}

export const getUserByEmail = async (email: User['email']) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        email
      }
    });

    if (user) {
      return user;
    }
  } catch (err: unknown) {
    if (err instanceof Prisma.PrismaClientKnownRequestError || err instanceof Prisma.PrismaClientValidationError) {
      throw new ClientRequestError();
    } else {
      throw new Error();
    }
  }
}

export const getUserProfile = async (id: User["ID"]) => {
  try {
    const user = await getUserByID(id);
    
    if (user) {
      return {
        ID: user.ID,
        email: user.email,
        avatar: user.avatar
      } as UserProfile
    }
  } catch (err: unknown) {
    console.log(err);
    throw new Error();
  }
}

export const isPasswordRecoveryTokenValid = async (token: User['passwordRecoveryHash']) => {
  try { 
    const user = await prisma.user.findFirst({
      where: {
        passwordRecoveryHash: token
      }
    });
  
    if (user) {
      const isTokenValid = user.passwordRecoveryTimestamp! > new Date();
      return isTokenValid;
    } else {
      return false;
    }
  } catch (err: unknown) {
    if (err instanceof Prisma.PrismaClientKnownRequestError || err instanceof Prisma.PrismaClientValidationError) {
      throw new ClientRequestError();
    } else {
      throw new Error();
    }
  }
}

export const loginUser = async (loginData: UserLoginData) => {
  const { email, password } = loginData;

  try {
    const user = await prisma.user.findFirst({
      where: {
        email: email,
      }
    });

    if (user) {
      const isPasswordOk = await verify(user.password, password);

      if (isPasswordOk) {
        logger.log('info', `User with email ${email} has logged in.`);

        return user;
      } else {
        throw Error();
      }
    }
  } catch (err: unknown) {
    if (err instanceof Prisma.PrismaClientKnownRequestError || err instanceof Prisma.PrismaClientValidationError) {
      throw new ClientRequestError();
    } else {
      throw new Error();
    }
  }
}