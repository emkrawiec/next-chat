-- CreateTable
CREATE TABLE "PaymentIntent" (
    "ID" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "featureId" INTEGER NOT NULL,

    CONSTRAINT "PaymentIntent_pkey" PRIMARY KEY ("ID")
);

-- AddForeignKey
ALTER TABLE "PaymentIntent" ADD CONSTRAINT "PaymentIntent_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("ID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PaymentIntent" ADD CONSTRAINT "PaymentIntent_featureId_fkey" FOREIGN KEY ("featureId") REFERENCES "Feature"("ID") ON DELETE RESTRICT ON UPDATE CASCADE;
