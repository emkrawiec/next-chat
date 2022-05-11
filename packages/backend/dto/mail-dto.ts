import { z } from 'zod';
import { EMAIL_TYPES } from '../services/mail';

const MailDTO = z.object({
  to: z.string().email(),
  subject: z.string(),
  message: z.string().nonempty(),
});

const WelcomeEmailDTO = MailDTO.pick({
  to: true,
});

const PasswordRecoveryEmailDTO = MailDTO.pick({
  to: true,
}).extend({
  link: z.string(),
});

const MailJobDTO = MailDTO.extend({
  type: z.nativeEnum(EMAIL_TYPES),
});

export type MailJobDTO = z.infer<typeof MailJobDTO>;
export type WelcomeEmailDTO = z.infer<typeof WelcomeEmailDTO>;
export type PasswordRecoveryEmailDTO = z.infer<typeof PasswordRecoveryEmailDTO>;
export type MailDTO = z.infer<typeof MailDTO>;
