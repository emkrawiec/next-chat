/*
  Warnings:

  - Added the required column `paymentGatewayPaymentIntentId` to the `PaymentIntent` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "PaymentIntentStatus" AS ENUM ('PENDING', 'SUCCESS', 'FAILED');

-- AlterTable
ALTER TABLE "PaymentIntent" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "paymentGatewayPaymentIntentId" TEXT NOT NULL,
ADD COLUMN     "paymentStatus" "PaymentIntentStatus" NOT NULL DEFAULT E'PENDING';
