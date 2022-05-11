import { z } from 'zod';

export const UserSignupPayload = z.object({
  email: z.string().nonempty(),
  password: z.string().nonempty(),
});

export const UserLoginPayload = z.object({
  email: z.string().nonempty(),
  password: z.string().nonempty(),
});

const PasswordRecoveryPreparePayload = z.object({
  email: z.string().email(),
});

const PasswordRecoveryPayload = z.object({
  token: z.string().nonempty(),
  newPassword: z.string().nonempty(),
});

const PasswordRecoveryDTO = PasswordRecoveryPayload.extend({});

export type PasswordRecoveryPreparePayload = z.infer<
  typeof PasswordRecoveryPreparePayload
>;
export type PasswordRecoveryPayload = z.infer<typeof PasswordRecoveryPayload>;
export type PasswordRecoveryDTO = z.infer<typeof PasswordRecoveryDTO>;
export type UserLoginPayload = z.infer<typeof UserLoginPayload>;
