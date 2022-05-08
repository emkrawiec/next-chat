export type User = {
  ID: number;
  email: string;
  password: string;
  passwordRecoveryTimestamp: Date | null;
  passwordRecoveryHash: string | null;
  avatar: string | null;
  paymentGatewayCustomerID: string | null;
};

export type UserProfile = Pick<User, 'ID' | 'email' | 'avatar'>

export type Room = {
  ID: number;
  name: string;
  createdAt: Date;
  archivedAt: Date | null;
  creatorUserId: number;
};

export type Message = {
  ID: number;
  createdAt: Date;
  message: string;
  roomId: number;
  authorId: number;
};

export type LoginPayload = {
  email: string;
  password: string;
};

export type SignupPayload = {
  email: string;
  password: string;
};

export type CreateRoomPayload = {
  name: string;
  createdAt: string;
  userIds: string[];
}

export type EditRoomPayload = {
  name: string;
  userIds: string[];
}

export type CreateSubscriptionPayload = {
  featureId: number;
  priceId: number;
}

export type CreateSubscriptionResponsePayload = { 
  checkoutSessionId: string;
}

export type PasswordRecoveryPreparePayload = {
  token: string;
  email: string;
};

export type PasswordRecoveryPayload = {
  token: string;
  newPassword: string;
}

export type JoinRoomPayload = {
  roomId: Room["ID"];
};

export type LeaveRoomPayload = JoinRoomPayload;

export type PostMessagePayload = {
  createdAt: Date;
  roomId: Room["ID"];
  userId: User["ID"];
  message: string;
};

export type GetRoomsResponsePayload = {
  ID: Room['ID'];
  name: Room['name'];
  users: {
    user: {
      email: User['email']
    }
  }[]
}[]