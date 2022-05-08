-- CreateTable
CREATE TABLE "KickedOutUsersRooms" (
    "userId" INTEGER NOT NULL,
    "roomId" INTEGER NOT NULL,

    CONSTRAINT "KickedOutUsersRooms_pkey" PRIMARY KEY ("userId","roomId")
);

-- AddForeignKey
ALTER TABLE "KickedOutUsersRooms" ADD CONSTRAINT "KickedOutUsersRooms_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("ID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "KickedOutUsersRooms" ADD CONSTRAINT "KickedOutUsersRooms_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "Room"("ID") ON DELETE CASCADE ON UPDATE CASCADE;
