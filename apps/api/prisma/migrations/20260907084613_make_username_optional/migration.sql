-- DropIndex
DROP INDEX "user_username_idx";

-- DropIndex
DROP INDEX "user_username_key";

-- AlterTable
ALTER TABLE "user" ALTER COLUMN "username" DROP NOT NULL;
