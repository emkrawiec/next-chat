import {
  ArchiveRoomDTO,
  EditRoomDTO,
  KickUserOutOfRoomDTO,
  RemoveRoomDTO,
} from "./../../dto/room-dto";
import mitt from "mitt";
import { User } from "@next-chat/types";
import { redis } from "../../core/redis";
import { logger } from "../log/logger";
import { prisma } from "../../prisma/init";
import { CreateRoomDTO } from "../../dto/room-dto";
import { Room } from ".prisma/client";

const roomUsersRedisKeyFactory = (roomId: Room["ID"]) =>
  `room:users:id-${roomId}`;

export const roomEventEmitter = mitt<{
  "room:user-join": RoomUserEvent;
  "room:user-leave": RoomUserEvent;
  "room:user-kicked": RoomUserEvent;
  "room:updated": RoomUpdateEvent;
}>();

export const createRoom = async (createRoomData: CreateRoomDTO) => {
  const { name, createdAt, creatorUserId, userIds } = createRoomData;
  const roomUserIds = [
    {
      userId: creatorUserId,
    },
    ...userIds.map((uId) => ({
      userId: uId,
    })),
  ];

  try {
    const room = await prisma.room.create({
      data: {
        name,
        createdAt,
        creatorUserId,
        users: {
          createMany: {
            data: roomUserIds,
          },
        },
      },
    });

    logger.log(
      "info",
      `User with ID ${creatorUserId} created room with users ${roomUserIds.reduce(
        (acc, uId, i, arr) =>
          `${acc}${uId.userId}${i !== arr.length - 1 ? ", " : ""}`,
        ""
      )}.`
    );

    return room;
  } catch (err: unknown) {
    console.log(err);
  }
};

export const removeRoom = async (dto: RemoveRoomDTO) => {
  const { roomId } = dto;

  try {
    await prisma.room.delete({
      where: {
        ID: roomId,
      },
    });
  } catch (err: unknown) {
    console.log(err);
  }
};

export const archiveRoom = async (dto: ArchiveRoomDTO) => {
  const { roomId } = dto;

  try {
    await prisma.room.update({
      where: {
        ID: roomId,
      },
      data: {
        archivedAt: new Date(),
      },
    });
  } catch (err: unknown) {
    console.log(err);
  }
};

export const editRoom = async (dto: EditRoomDTO) => {
  const { name, creatorId, roomId, userIds } = dto;

  try {
    const room = await getRoom(roomId);
    if (!room) return;

    const userIdsWithRoomIdsToDelete = room.users
      .filter(({ userId }) => !userIds.includes(userId) && userId !== creatorId)
      .map(({ userId }) => ({ userId, roomId }));
    const userIdsToAddToRoom = userIds
      .filter((uid) => !room.users.find((u) => u.userId === uid))
      .map((uid) => ({ userId: uid }));

    await prisma.room.update({
      data: {
        name,
        users: {
          createMany: {
            data: userIdsToAddToRoom,
          },
          deleteMany: userIdsWithRoomIdsToDelete,
        },
      },
      where: {
        ID: roomId,
      },
    });
  } catch (err: unknown) {
    console.log(err);
  }
};

export const kickUserOutOfRoom = async (dto: KickUserOutOfRoomDTO) => {
  const { roomId, userId } = dto;

  try {
    await prisma.kickedOutUsersRooms.create({
      data: {
        roomId,
        userId,
      },
    });

    logger.log(
      "info",
      `User with ID ${userId} has been kicked out of room with ID ${roomId}.`
    );

    roomEventEmitter.emit("room:user-kicked", {
      roomId,
      userId,
    });
  } catch (err: unknown) {
    console.log(err);
  }
};

export const getRoomMembers = async (roomId: Room["ID"]) => {
  const roomMembersUserIds = await redis.smembers(
    roomUsersRedisKeyFactory(roomId)
  );
  return roomMembersUserIds;
};

export const joinRoom = async (userId: User["ID"], roomId: Room["ID"]) => {
  await redis.sadd(roomUsersRedisKeyFactory(roomId), userId);
  roomEventEmitter.emit("room:user-join", {
    roomId,
    userId,
  });
};

export const leaveRoom = async (userId: User["ID"], roomId: Room["ID"]) => {
  await redis.srem(roomUsersRedisKeyFactory(roomId), userId);
  roomEventEmitter.emit("room:user-leave", {
    roomId,
    userId,
  });
};

export const getRoom = async (roomId: Room["ID"]) => {
  try {
    const room = await prisma.room.findFirst({
      select: {
        ID: true,
        name: true,
        archivedAt: true,
        createdAt: true,
        kickedUsers: true,
        users: {
          select: {
            userId: true,
          },
        },
        creator: {
          select: {
            ID: true,
            email: true,
          },
        },
      },
      where: {
        ID: roomId,
      },
    });

    return room;
  } catch (err: unknown) {
    console.log(err);
  }
};

export const getUserRooms = async (userId: User["ID"]) => {
  try {
    const rooms = await prisma.room.findMany({
      select: {
        ID: true,
        name: true,
        creator: {
          select: {
            ID: true,
            email: true,
          },
        },
        users: {
          select: {
            user: {
              select: {
                email: true,
              },
            },
          },
        },
      },
      where: {
        archivedAt: null,
        users: {
          some: {
            userId: {
              equals: userId,
            },
          },
        },
      },
    });

    return rooms;
  } catch (err: unknown) {
    console.log(err);
  }
};
