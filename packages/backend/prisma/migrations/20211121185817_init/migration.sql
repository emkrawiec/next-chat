/*
  Warnings:

  - Added the required column `test` to the `Message` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `Room` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Message" ADD COLUMN     "test" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Room" ADD COLUMN     "name" TEXT NOT NULL;
