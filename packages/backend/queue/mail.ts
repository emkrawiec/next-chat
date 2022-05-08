import { MailJobDTO } from '../dto/mail-dto';
import Bull, { Job } from 'bull';
import { mailJobHandler } from '../jobs/mail';
import { EMAIL_TYPES } from '../services/mail';
import { logger } from '../services/log/logger';

export const mailQueue = new Bull<MailJobDTO>("email");

const mailJobSuccessHandler = (job: Job<MailJobDTO>) => {
  const dto = job.data;
  
  switch (dto.type) {
    case EMAIL_TYPES.WELCOME_EMAIL: {
      logger.log('info', `Welcome email for user with email ${dto.to} has been sent.`);
      break;
    }
    case EMAIL_TYPES.PASSWORD_RECOVERY_EMAIL: {
      logger.log('info', `Password recovery email for user with email ${dto.to} has been sent.`);
      break;
    }
    default: {
      logger.log('info', `Generic email to ${dto.to} has been sent.`);
    }
  }
}

mailQueue.process(mailJobHandler);
mailQueue.on('completed', mailJobSuccessHandler);