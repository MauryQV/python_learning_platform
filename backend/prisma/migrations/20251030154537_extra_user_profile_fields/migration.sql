-- AlterTable
ALTER TABLE "User" ADD COLUMN     "bio" VARCHAR(150),
ADD COLUMN     "birthday" TIMESTAMP(3),
ADD COLUMN     "gender" TEXT,
ADD COLUMN     "profession" TEXT;
