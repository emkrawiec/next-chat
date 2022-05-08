import { z } from "zod";

const UserRegisterData = z.object({
  email: z.string().nonempty(),
  password: z.string().nonempty(),
});

const UserLoginData = z.object({
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

export const userRegisterDataValidator = UserRegisterData.parse.bind(UserRegisterData);
export const userLoginDataValidator = UserLoginData.parse.bind(UserLoginData);

export type UserRegisterData = z.infer<typeof UserRegisterData>
export type PasswordRecoveryPreparePayload = z.infer<typeof PasswordRecoveryPreparePayload>
export type PasswordRecoveryPayload = z.infer<typeof PasswordRecoveryPayload>
export type PasswordRecoveryDTO = z.infer<typeof PasswordRecoveryDTO>
export type UserLoginData = z.infer<typeof UserLoginData>