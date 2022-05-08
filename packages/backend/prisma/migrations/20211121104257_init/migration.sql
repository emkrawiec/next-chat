/*
  Warnings:

  - You are about to drop the column `userId` on the `Room` table. All the data in the column will be lost.
  - Added the required column `creatorUserId` to the `Room` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Room" DROP CONSTRAINT "Room_userId_fkey";

-- AlterTable
ALTER TABLE "Room" DROP COLUMN "userId",
ADD COLUMN     "creatorUserId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Room" ADD CONSTRAINT "Room_creatorUserId_fkey" FOREIGN KEY ("creatorUserId") REFERENCES "User"("ID") ON DELETE RESTRICT ON UPDATE CASCADE;
