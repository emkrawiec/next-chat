import { User } from "@next-chat/types";

export type EditUserProfileDTO = {
  userId: User['ID'];
  avatar?: string;
  paymentGatewayCustomerID?: string;
}

