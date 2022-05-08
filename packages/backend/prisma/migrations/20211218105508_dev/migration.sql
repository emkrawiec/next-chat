/*
  Warnings:

  - You are about to drop the column `stripeCustomerID` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "stripeCustomerID",
ADD COLUMN     "paymentGatewayCustomerID" TEXT;
