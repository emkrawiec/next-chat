type GetMessagesData = {
  roomId: Room['ID'];
  userId: User['ID'];
}

type RoomUpdateEvent = {
  roomId: Room['ID'];
}

type RoomUserEvent = RoomUpdateEvent & {
  userId: User['ID'];
}