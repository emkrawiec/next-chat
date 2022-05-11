export type APIUserProfile = {
  ID: number;
  email: string;
  avatar: string | null;
};

export type Room = {
  ID: number;
  name: string;
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

export type APISignupRequestPayload = {
  email: string;
  password: string;
}

export type CreateRoomRequestPayload = {
  name: string;
  createdAt: string;
  userIds: string[];
}

export type EditRoomRequestPayload = {
  name: string;
  userIds: string[];
}

export type CreatePaymentIntentPayload = {
  featureId: number;
  priceId: number;
}

export type APICreatePaymentIntentResponsePayload = { 
  checkoutSessionId: string;
}

export type APIPasswordRecoveryPrepareRequestPayload = {
  token: string;
  email: string;
};

export type APICheckPasswordRecoveryTokenRequestPayload = {
  token: string;
}

export type APIGetFeatureRequestPayload = {
  featureId: string;
}

export type APIPasswordRecoveryRequestPayload = {
  token: string;
  newPassword: string;
}

export type JoinRoomRequestPayload = {
  roomId: Room["ID"];
};

export type LeaveRoomPayload = JoinRoomPayload;

export type PostMessageRequestPayload = {
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

export type APIPaymentPayload = {
  featureId: number;
  priceId: number;
}