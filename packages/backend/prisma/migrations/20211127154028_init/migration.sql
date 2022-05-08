-- AlterTable
ALTER TABLE "User" ADD COLUMN     "passwordRecoveryHash" TEXT,
ADD COLUMN     "passwordRecoveryTimestamp" TIMESTAMP(3);
