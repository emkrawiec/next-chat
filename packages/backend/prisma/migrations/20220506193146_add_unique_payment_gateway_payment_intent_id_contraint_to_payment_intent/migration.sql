/*
  Warnings:

  - A unique constraint covering the columns `[paymentGatewayPaymentIntentId]` on the table `PaymentIntent` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "PaymentIntent_paymentGatewayPaymentIntentId_key" ON "PaymentIntent"("paymentGatewayPaymentIntentId");
