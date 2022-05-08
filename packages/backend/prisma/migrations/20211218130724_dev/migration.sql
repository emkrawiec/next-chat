/*
  Warnings:

  - You are about to drop the column `paymentGatewayProductID` on the `Feature` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Feature" DROP COLUMN "paymentGatewayProductID",
ADD COLUMN     "paymentGatewayPriceID" TEXT;
