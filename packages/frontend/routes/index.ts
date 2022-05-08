import { Room } from "@next-chat/types";

export const ROUTES = {
    rooms: '/rooms',
  editRoom: (roomId: Room['ID']) => `${ROUTES.rooms}/edit/${roomId}`
}