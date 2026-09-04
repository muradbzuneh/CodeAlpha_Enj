-- AlterTable: Add username and bio columns to user table
ALTER TABLE "user" ADD COLUMN "username" TEXT NOT NULL DEFAULT '';
ALTER TABLE "user" ADD COLUMN "bio" TEXT;

-- Backfill existing users: use email prefix + first 6 chars of ID for uniqueness
UPDATE "user" SET "username" = LOWER(SPLIT_PART("email", '@', 1)) || '_' || SUBSTRING("id" FROM 1 FOR 6);

-- Remove default now that existing rows are backfilled
ALTER TABLE "user" ALTER COLUMN "username" DROP DEFAULT;

-- Unique constraint and index on username
CREATE UNIQUE INDEX "user_username_key" ON "user"("username");
CREATE INDEX "user_username_idx" ON "user"("username");
