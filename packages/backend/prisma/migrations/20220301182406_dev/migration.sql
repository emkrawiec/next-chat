/*
  Warnings:

  - Added the required column `priceId` to the `Price` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Price" ADD COLUMN     "priceId" TEXT NOT NULL;
