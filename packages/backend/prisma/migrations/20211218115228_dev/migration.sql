/*
  Warnings:

  - You are about to drop the column `paymentGatewayFeatureID` on the `Feature` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Feature" DROP COLUMN "paymentGatewayFeatureID",
ADD COLUMN     "paymentGatewayProductID" TEXT;
