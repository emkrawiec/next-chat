/*
  Warnings:

  - You are about to drop the column `name` on the `Feature` table. All the data in the column will be lost.
  - You are about to drop the column `paymentGatewayPriceID` on the `Feature` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Feature" DROP COLUMN "name",
DROP COLUMN "paymentGatewayPriceID";

-- CreateTable
CREATE TABLE "Price" (
    "ID" SERIAL NOT NULL,
    "featureId" INTEGER NOT NULL,

    CONSTRAINT "Price_pkey" PRIMARY KEY ("ID")
);

-- AddForeignKey
ALTER TABLE "Price" ADD CONSTRAINT "Price_featureId_fkey" FOREIGN KEY ("featureId") REFERENCES "Feature"("ID") ON DELETE RESTRICT ON UPDATE CASCADE;
