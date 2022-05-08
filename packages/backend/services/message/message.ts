import { CreateMessageData, GetRoomMessagesPayload } from "../../dto/room-dto";
import { prisma } from "../../prisma/init"

export const createMessage = async (createMessageData: CreateMessageData) => {
  const { createdAt, message, roomId, userId } = createMessageData;

  try {
    const newMessage = await prisma.message.create({
      data: {
        createdAt,
        message,
        authorId: userId,
        roomId
      }
    });

    return newMessage;
  } catch (err: unknown) {
    console.log(err);
  }
}

export const getMessagesForRoom = async (getMessagesData: GetRoomMessagesPayload) => {
  const { roomId } = getMessagesData;

  try {
    const messages = await prisma.message.findMany({
      where: {
        roomId
      },
    });

    return messages;
  } catch (err: unknown) {
    console.log(err);
  }
}