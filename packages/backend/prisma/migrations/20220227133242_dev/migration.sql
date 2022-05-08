-- DropForeignKey
ALTER TABLE "Message" DROP CONSTRAINT "Message_roomId_fkey";

-- DropForeignKey
ALTER TABLE "UsersRooms" DROP CONSTRAINT "UsersRooms_roomId_fkey";

-- AddForeignKey
ALTER TABLE "UsersRooms" ADD CONSTRAINT "UsersRooms_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "Room"("ID") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "Room"("ID") ON DELETE CASCADE ON UPDATE CASCADE;
