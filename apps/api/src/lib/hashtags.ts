import { prisma } from "../lib/prisma.js";

export async function extractAndSaveHashtags(postId: string, content: string) {
  const matches = content.match(/#[\w\u0590-\u05FF]+/g);
  if (!matches || matches.length === 0) return;

  const tags = [...new Set(matches.map((m) => m.toLowerCase()))];

  for (const tag of tags) {
    await prisma.postHashtag.upsert({
      where: { tag_postId: { tag, postId } },
      update: {},
      create: { tag, postId },
    });
  }
}

export async function removeHashtags(postId: string) {
  await prisma.postHashtag.deleteMany({ where: { postId } });
}
