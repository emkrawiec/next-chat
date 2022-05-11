import { mailer } from './setup';
import {
  MailDTO,
  WelcomeEmailDTO,
  PasswordRecoveryEmailDTO,
} from '../../dto/mail-dto';
import { mailQueue } from '../../queue/mail';
import { getEmailTemplate } from '../../email/get-email-templates';

export enum EMAIL_TYPES {
  WELCOME_EMAIL,
  PASSWORD_RECOVERY_EMAIL,
}

export const sendMail = async (dto: MailDTO) => {
  try {
    const { message, subject, to } = dto;

    const result = await mailer.post('send').request({
      Messages: [
        {
          FromEmail: 'next-chat@michalkrawiec.com',
          FromName: 'Next Chat Bot',
          Recipients: [
            {
              Email: to,
            },
          ],
          Subject: subject,
          'Html-part': message,
        },
      ],
    });

    // @ts-ignore
    if (result.body.Sent) {
      return;
    } else {
      throw Error();
    }
  } catch (err) {
    console.log(err);
  }
};

export const sendWelcomeMail = async (dto: WelcomeEmailDTO) => {
  try {
    await mailQueue.add({
      to: dto.to,
      subject: 'Welcome to the Next chat!',
      type: EMAIL_TYPES.WELCOME_EMAIL,
      message: await getEmailTemplate({
        type: 'WELCOME',
      }),
    });
  } catch (err) {
    console.log(err);
  }
};

export const sendPasswordRecoveryEmail = async (
  dto: PasswordRecoveryEmailDTO
) => {
  try {
    const templateWithLink = await await getEmailTemplate({
      type: 'PASSWORD_RESET',
      ctx: {
        reset_password_link: dto.link,
      },
    });

    console.log(templateWithLink);

    await mailQueue.add({
      to: dto.to,
      subject: 'Password recovery for next-chat!',
      type: EMAIL_TYPES.PASSWORD_RECOVERY_EMAIL,
      message: templateWithLink,
    });
  } catch (err) {
    console.log(err);
  }
};
