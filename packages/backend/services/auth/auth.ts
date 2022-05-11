import { hash, verify } from 'argon2';
import { v4 } from 'uuid';
//
import { PasswordRecoveryDTO } from './../../dto/auth-dto';
import { sendPasswordRecoveryEmail } from './../mail/mail';
import { prisma } from '../../prisma/init';
import { User } from '.prisma/client';
import { logger } from '../log/logger';
import { sendWelcomeMail } from '../mail';
import { prismaErrorWrapper } from '../../utils/error';

type UserProfile = Pick<User, 'ID' | 'email' | 'avatar'>;

export const processUserSignup = async (userData: UserRegisterData) => {
  const maybeTakenUser = await getUserByEmail(userData.email);

  if (maybeTakenUser) {
    return signupUser(userData);
  } else {
    throw Error();
  }
};

export const signupUser = prismaErrorWrapper(
  async (userData: UserRegisterData) => {
    const { email, password } = userData;

    const hashedPass = await hash(password);

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPass,
      },
    });

    logger.log('info', `User with email ${email} has signed up.`);

    await sendWelcomeMail({
      to: email,
    });

    return user;
  }
);

const preparePasswordRecovery = prismaErrorWrapper(
  async (email: User['email']) => {
    const hash = v4();

    await prisma.user.update({
      where: {
        email,
      },
      data: {
        passwordRecoveryHash: hash,
        // 7 days.
        passwordRecoveryTimestamp: new Date(Date.now() + 1000 * 3600 * 24 * 7),
      },
    });

    return hash;
  }
);

export const processPasswordRecoveryPreparation = async (
  email: User['email']
) => {
  const user = await getUserByEmail(email);

  if (user) {
    const hash = await preparePasswordRecovery(email);
    const recoveryLink = new URL(process.env.APP_URL);
    recoveryLink.searchParams.set('token', hash);
    recoveryLink.pathname = '/password-recovery';

    await sendPasswordRecoveryEmail({
      link: recoveryLink.toString(),
      to: user.email,
    });
  } else {
    throw new Error();
  }
};

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
};

const getUserByPasswordRecoveryToken = prismaErrorWrapper(
  async (token: User['passwordRecoveryHash']) => {
    const user = await prisma.user.findFirst({
      where: {
        passwordRecoveryHash: token,
      },
    });

    if (user) {
      return user;
    }
  }
);

const changeUserPassword = prismaErrorWrapper(
  async (id: User['ID'], newPassword: User['password']) => {
    const newPasswordHash = await hash(newPassword);

    await prisma.user.update({
      where: {
        ID: id,
      },
      data: {
        password: newPasswordHash,
      },
    });
  }
);

const clearPasswordHashAndTimestamp = prismaErrorWrapper(
  async (id: User['ID']) => {
    await prisma.user.update({
      where: {
        ID: id,
      },
      data: {
        passwordRecoveryHash: null,
        passwordRecoveryTimestamp: null,
      },
    });
  }
);

export const getUserByID = prismaErrorWrapper(async (id: User['ID']) => {
  const user = await prisma.user.findUnique({
    where: {
      ID: id,
    },
  });

  if (user) {
    return user;
  }
});

export const getUserByEmail = prismaErrorWrapper(
  async (email: User['email']) => {
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (user) {
      return user;
    }
  }
);

export const getUserProfile = async (id: User['ID']) => {
  const user = await getUserByID(id);

  if (user) {
    return {
      ID: user.ID,
      email: user.email,
      avatar: user.avatar,
    } as UserProfile;
  }
};

export const isPasswordRecoveryTokenValid = prismaErrorWrapper(
  async (token: User['passwordRecoveryHash']) => {
    const user = await prisma.user.findFirst({
      where: {
        passwordRecoveryHash: token,
      },
    });

    if (user) {
      const isTokenValid = user.passwordRecoveryTimestamp! > new Date();
      return isTokenValid;
    } else {
      return false;
    }
  }
);

export const loginUser = prismaErrorWrapper(
  async (loginData: UserLoginData) => {
    const { email, password } = loginData;

    const user = await prisma.user.findFirst({
      where: {
        email: email,
      },
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
  }
);
