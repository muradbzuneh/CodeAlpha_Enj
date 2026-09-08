-- CreateTable
CREATE TABLE "story" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "authorId" TEXT NOT NULL,
    "content" TEXT,
    "mediaUrl" TEXT,
    "gradient" TEXT NOT NULL DEFAULT 'from-[#FF3366] via-[#FF5E7E] to-[#FFAA00]',
    "moodEmoji" TEXT,

    CONSTRAINT "story_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "story_view" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "storyId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "story_view_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "story_authorId_idx" ON "story"("authorId");

-- CreateIndex
CREATE INDEX "story_createdAt_idx" ON "story"("createdAt");

-- CreateIndex
CREATE INDEX "story_expiresAt_idx" ON "story"("expiresAt");

-- CreateIndex
CREATE UNIQUE INDEX "story_view_storyId_userId_key" ON "story_view"("storyId", "userId");

-- CreateIndex
CREATE INDEX "story_view_storyId_idx" ON "story_view"("storyId");

-- CreateIndex
CREATE INDEX "story_view_userId_idx" ON "story_view"("userId");

-- AddForeignKey
ALTER TABLE "story" ADD CONSTRAINT "story_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "story_view" ADD CONSTRAINT "story_view_storyId_fkey" FOREIGN KEY ("storyId") REFERENCES "story"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "story_view" ADD CONSTRAINT "story_view_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
