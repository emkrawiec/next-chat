import { mailer } from './setup';
import { MailDTO, WelcomeEmailDTO, PasswordRecoveryEmailDTO } from '../../dto/mail-dto';
import { mailQueue } from '../../queue/mail';

export enum EMAIL_TYPES {
  WELCOME_EMAIL,
  PASSWORD_RECOVERY_EMAIL
}

export const sendMail = async (dto: MailDTO) => {
  try {
    const sendEmailResult = await mailer.sendMail({
      from: "wordpress@stolarstwo-borecki.pl",
      ...dto
    });

    if (sendEmailResult.accepted) {
      return
    } else {
      throw Error();
    }
  } catch (err) {
    console.log(err);
  }
}

export const sendWelcomeMail = async (dto: WelcomeEmailDTO) => {
  try {
    await mailQueue.add({
      to: dto.to,
      subject: "Welcome to the Next chat!",
      message: "Good to see you in next chat!",
      type: EMAIL_TYPES.WELCOME_EMAIL,
    });
  } catch (err) {
    console.log(err);
  }
}

export const sendPasswordRecoveryEmail = async (dto: PasswordRecoveryEmailDTO) => {
  try {
    await mailQueue.add({
      to: dto.to,
      subject: "Password recovery for next chat to the Next chat!",
      message: `Link to recover your password is ${dto.link}`,
      type: EMAIL_TYPES.PASSWORD_RECOVERY_EMAIL,
    });
  } catch (err) {
    console.log(err);
  }
}