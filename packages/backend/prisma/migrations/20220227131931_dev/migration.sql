-- DropForeignKey
ALTER TABLE "UsersRooms" DROP CONSTRAINT "UsersRooms_roomId_fkey";

-- AddForeignKey
ALTER TABLE "UsersRooms" ADD CONSTRAINT "UsersRooms_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "Room"("ID") ON DELETE NO ACTION ON UPDATE CASCADE;
