import {
  User,
  LoginPayload,
  SignupPayload,
  PasswordRecoveryPreparePayload,
  PasswordRecoveryPayload,
} from "@next-chat/types";
import axios from "axios";

export const login = (loginPayload: LoginPayload) => {
  return axios.post(
    `${process.env.NEXT_PUBLIC_HTTP_API_URL}/api/login`,
    loginPayload
  );
};

export const signup = (signupPayload: SignupPayload) => {
  return axios.post(
    `${process.env.NEXT_PUBLIC_HTTP_API_URL}/api/signup`,
    signupPayload
  );
};

export const getUser = () => {
  return axios.get(`${process.env.NEXT_PUBLIC_HTTP_API_URL}/api/user`);
}

export const logout = async () => {
  await axios.get(`${process.env.NEXT_PUBLIC_HTTP_API_URL}/api/logout`);
}

export const checkPasswordRecoveryToken = (
  token: User["passwordRecoveryHash"]
) => {
  return axios.post(
    `${process.env.NEXT_PUBLIC_HTTP_API_URL}/api/check-recovery-token`,
    {
      token,
    }
  );
};

export const preparePasswordRecovery = (
  passwordRecoveryPreparePayload: PasswordRecoveryPreparePayload
) => {
  return axios.post(
    `${process.env.NEXT_PUBLIC_HTTP_API_URL}/api/forgot`,
    passwordRecoveryPreparePayload
  );
};

export const recoverPassword = (
  passwordRecoveryPayload: PasswordRecoveryPayload
) => {
  return axios.post(
    `${process.env.NEXT_PUBLIC_HTTP_API_URL}/api/pass-recovery`,
    passwordRecoveryPayload
  );
};
