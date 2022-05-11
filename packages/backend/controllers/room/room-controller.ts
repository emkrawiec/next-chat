import Express from 'express';
import omit from 'just-omit';
import { Socket } from 'socket.io';
//
import { EmptyObject, LeaveRoomPayload, Room } from '@next-chat/types';
//
import { ClientRequestError } from '../../error/ClientRequestError';
import {
  createRoom,
  getRoomMembers,
  getUserRooms,
  joinRoom,
  leaveRoom,
  removeRoom,
  archiveRoom,
  kickUserOutOfRoom,
  getRoom,
  editRoom,
} from '../../services/room';
import { createMessage, getMessagesForRoom } from '../../services/message';
import { logger } from '../../services/log/logger';
import {
  CreateRoomData,
  CreateMessagePayload,
  createRoomDataValidator,
  GetRoomMessagesPayload,
  CreateMessageData,
  ArchiveRoomDTO,
  RemoveRoomDTO,
  KickUserOutOfRoomDTO,
  KickUserOutOfRoomPayload,
  EditRoomDTO,
  EditRoomPayload,
} from '../../dto/room-dto';
import { getUserProfilesByIds } from '../../services/user';

const getRoomMembersUserProfiles = (roomId: Room['ID']) =>
  getRoomMembers(roomId).then((userIds) =>
    getUserProfilesByIds(userIds.map((uid) => Number(uid)))
  );

const getRoomData = (roomId: Room['ID']) =>
  getRoom(roomId).then((roomData) => ({
    ...omit<Room, keyof Room>(roomData, 'kickedUsers'),
    kickedUserIds: roomData?.kickedUsers.map((r) => r.userId),
  }));

export const validateCreateRoomActionPayloadMiddleware = (
  req: Express.Request,
  res: Express.Response,
  next: Express.NextFunction
) => {
  try {
    createRoomDataValidator(req.body);
    next();
  } catch (err: unknown) {
    return res.status(400).send();
  }
};

export const createRoomHTTPAction = async (
  req: Express.Request,
  res: Express.Response
) => {
  const creatorUserId = req.user!.ID;
  const { name, createdAt, userIds } = req.body;

  const createRoomData: CreateRoomData = {
    name,
    createdAt,
    creatorUserId,
    userIds,
  };

  try {
    const room = await createRoom(createRoomData);

    res.status(201).json(room);
  } catch (err: unknown) {
    if (err instanceof ClientRequestError) {
      res.status(400).send();
    } else {
      res.status(500).send();
    }
  }
};

export const kickUserOutOfRoomHTTPAction = async (
  req: Express.Request<EmptyObject, EmptyObject, KickUserOutOfRoomPayload>,
  res: Express.Response
) => {
  const { roomId, userId } = req.body;

  const dto: KickUserOutOfRoomDTO = {
    roomId,
    userId,
  };

  try {
    kickUserOutOfRoom(dto);

    res.status(200).send();
  } catch (err: unknown) {
    console.log(err);
  }
};

export const archiveRoomHTTPAction = async (
  req: Express.Request<{
    id: string;
  }>,
  res: Express.Response
) => {
  const userId = req.user!.ID;
  const { id } = req.params;

  const dto: ArchiveRoomDTO = {
    roomId: Number(id),
  };

  try {
    await archiveRoom(dto);

    res.status(200).send();
  } catch (err: unknown) {
    if (err instanceof ClientRequestError) {
      res.status(400).send();
    } else {
      res.status(500).send();
    }
  }
};

export const removeRoomHTTPAction = async (
  req: Express.Request<{
    id: Room['ID'];
  }>,
  res: Express.Response
) => {
  const userId = req.user!.ID;
  const { id } = req.params;

  const dto: RemoveRoomDTO = {
    userId,
    roomId: Number(id),
  };

  try {
    await removeRoom(dto);

    res.status(204).send();
  } catch (err: unknown) {
    if (err instanceof ClientRequestError) {
      res.status(400).send();
    } else {
      res.status(500).send();
    }
  }
};

export const getRoomsHTTPAction = async (
  req: Express.Request,
  res: Express.Response
) => {
  const userId = req.user!.ID;

  try {
    const rooms = await getUserRooms(userId);

    return res.status(200).json(rooms);
  } catch (err: unknown) {
    if (err instanceof ClientRequestError) {
      res.status(400).send();
    } else {
      res.status(500).send();
    }
  }
};

export const getRoomHTTPAction = async (
  req: Express.Request<
    {
      id: string;
    },
    Room
  >,
  res: Express.Response
) => {
  const { id } = req.params;

  try {
    const room = await getRoom(Number(id));

    return res.status(200).json(room);
  } catch (err: unknown) {
    if (err instanceof ClientRequestError) {
      res.status(400).send();
    } else {
      res.status(500).send();
    }
  }
};

export const joinRoomWSAction =
  (socket: Socket) => async (payload: JoinRoomPayload) => {
    const { roomId } = payload;
    const userId = socket.request.user.ID;

    socket.join(String(roomId));
    await joinRoom(userId, roomId);

    logger.log('info', `User with ID ${userId} joined room with ID ${roomId}`);
  };

export const leaveRoomWSAction =
  (socket: Socket) => async (payload: LeaveRoomPayload) => {
    const { roomId } = payload;
    const userId = socket.request.user.ID;

    socket.leave(String(roomId));
    await leaveRoom(userId, roomId);

    logger.log('info', `User with ID ${userId} left room with ID ${roomId}`);
  };

export const createMessageHTTPAction = async (
  req: Express.Request,
  res: Express.Response
) => {
  const { roomId, createdAt, message } = req.body as CreateMessagePayload;
  const userId = req.user.ID;

  const createMessageData: CreateMessageData = {
    createdAt,
    message,
    roomId,
    userId,
  };

  try {
    const newMessage = await createMessage(createMessageData);

    return res.status(200).json(newMessage);
  } catch (err: unknown) {
    console.log(err);
  }
};

export const createMessageWSAction =
  (socket: Socket) => async (payload: CreateMessagePayload) => {
    const { roomId } = payload;
    const userId = socket.request.user.ID;

    const createMessageData: CreateMessageData = {
      ...payload,
      userId,
    };

    const newMessage = await createMessage(createMessageData);

    socket.in(String(roomId)).emit('room:new-message', newMessage);
    socket.emit('room:new-message', newMessage);
  };

export const getRoomMessagesAndMembersWSAction =
  () => async (payload: GetRoomMessagesPayload, fn) => {
    const { roomId } = payload;

    try {
      let [messages, users, roomData] = await Promise.all([
        getMessagesForRoom(payload),
        getRoomMembers(roomId).then((userIds) =>
          getUserProfilesByIds(userIds.map((uid) => Number(uid)))
        ),
        getRoomData(roomId),
      ]);

      if (!messages) {
        messages = [];
      }

      fn({
        messages,
        users,
        room: roomData,
      });
    } catch (err: unknown) {
      console.log(err);
    }
  };

export const editRoomHTTPAction = async (
  req: Express.Request<
    {
      id: string;
    },
    EmptyObject,
    EditRoomPayload
  >,
  res: Express.Response
) => {
  const userId = req.user!.ID;
  const { id: roomId } = req.params;
  const { name, userIds } = req.body;

  try {
    const dto: EditRoomDTO = {
      name,
      roomId: Number(roomId),
      creatorId: userId,
      userIds,
    };

    await editRoom(dto);

    return res.status(204).send();
  } catch (err: unknown) {
    if (err instanceof ClientRequestError) {
      res.status(400).send();
    } else {
      res.status(500).send();
    }
  }
};

export const updateRoomMembersAction =
  (socket: Socket) => async (payload: RoomUpdateEvent) => {
    const { roomId } = payload;
    const [userProfiles, roomData] = await Promise.all([
      getRoomMembersUserProfiles(roomId),
      getRoomData(roomId),
    ]);

    socket.in(String(roomId)).emit('room:update', {
      users: userProfiles,
      room: roomData,
    });
  };
