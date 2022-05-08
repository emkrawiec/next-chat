import { z } from "zod";

const CreateRoomData = z.object({
  name: z.string().nonempty(),
  createdAt: z.preprocess((v) => new Date(v as string), z.date()),
  userIds: z.number().array(),
});

const EditRoomPayload = z.object({
  name: z.string(),
  userIds: z.number().array()
});

const CreateMessagePayload = z.object({
  createdAt: z.preprocess((v) => new Date(v as string), z.date()),
  roomId: z.number(),
  message: z.string()
});

const KickUserOutOfRoomPayload = z.object({
  roomId: z.number(),
  userId: z.number()
});

const CreateMessageData = CreateMessagePayload.extend({
  userId: z.number(),
});

const GetRoomMessagesPayload = z.object({
  roomId: z.number()
});

const CreateRoomDTO = CreateRoomData.extend({
  creatorUserId: z.number(),
});

const ArchiveRoomDTO = z.object({
  roomId: z.number()
});

const KickUserOutOfRoomDTO = z.object({
  roomId: z.number(),
  userId: z.number()
});

const RemoveRoomDTO = z.object({
  userId: z.number(),
  roomId: z.number()
});

const EditRoomDTO = z.object({
  creatorId: z.number(),
  roomId: z.number(),
  name: z.string(),
  userIds: z.number().array()
});

export const createRoomDataValidator = CreateRoomData.parse.bind(CreateRoomData);
export const createMessagePayloadValidator = CreateMessagePayload.parse.bind(CreateMessagePayload);

export type CreateRoomData = z.infer<typeof CreateRoomData>
export type CreateRoomDTO = z.infer<typeof CreateRoomDTO>
export type ArchiveRoomDTO  = z.infer<typeof ArchiveRoomDTO>
export type EditRoomPayload = z.infer<typeof EditRoomPayload>
export type EditRoomDTO = z.infer<typeof EditRoomDTO>
export type RemoveRoomDTO  = z.infer<typeof RemoveRoomDTO>
export type KickUserOutOfRoomDTO  = z.infer<typeof KickUserOutOfRoomDTO>
export type KickUserOutOfRoomPayload  = z.infer<typeof KickUserOutOfRoomPayload>
export type CreateMessagePayload = z.infer<typeof CreateMessagePayload>
export type CreateMessageData = z.infer<typeof CreateMessageData>
export type GetRoomMessagesPayload = z.infer<typeof GetRoomMessagesPayload>