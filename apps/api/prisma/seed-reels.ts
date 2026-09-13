/**
 * Seed script to add demo posts with media for the Reels page.
 * Run: npx tsx prisma/seed-reels.ts
 */

import { PrismaClient } from "../src/generated/prisma/index.js";

const prisma = new PrismaClient();

const DEMO_POSTS = [
  {
    content: "Morning coffee vibes ☕ Nothing beats a fresh pour-over to start the day right.",
    mediaUrl: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&auto=format&fit=crop&q=80",
  },
  {
    content: "Golden hour at the beach 🌅 Nature's color palette is unmatched.",
    mediaUrl: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=80",
  },
  {
    content: "Mountain trails calling 🏔️ Adventure is out there, you just have to look.",
    mediaUrl: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&auto=format&fit=crop&q=80",
  },
  {
    content: "Street photography is a beautiful way to capture the soul of a city 📸",
    mediaUrl: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800&auto=format&fit=crop&q=80",
  },
  {
    content: "Plant life 🌿 Green spaces make everything better. Who else loves indoor plants?",
    mediaUrl: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800&auto=format&fit=crop&q=80",
  },
  {
    content: "Sunset surfing session 🏄‍♂️ The waves were perfect today.",
    mediaUrl: "https://images.unsplash.com/photo-1502680390548-bdbac40e4a20?w=800&auto=format&fit=crop&q=80",
  },
  {
    content: "Urban architecture never gets old. Clean lines, bold shapes 🏙️",
    mediaUrl: "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=800&auto=format&fit=crop&q=80",
  },
  {
    content: "Homemade pasta night 🍝 Fresh ingredients, simple recipe, incredible taste.",
    mediaUrl: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&auto=format&fit=crop&q=80",
  },
  {
    content: "Night city lights ✨ There's something magical about a city that never sleeps.",
    mediaUrl: "https://images.unsplash.com/photo-1514565131-fce0801e5785?w=800&auto=format&fit=crop&q=80",
  },
  {
    content: "Desert dunes at dawn 🏜️ The silence out here is deafening in the best way.",
    mediaUrl: "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?w=800&auto=format&fit=crop&q=80",
  },
];

async function main() {
  // Find any existing user to assign posts to
  const user = await prisma.user.findFirst();
  if (!user) {
    console.log("No users found. Create a user first, then run this seed.");
    return;
  }

  let created = 0;
  for (const post of DEMO_POSTS) {
    const existing = await prisma.post.findFirst({
      where: { content: post.content },
    });
    if (!existing) {
      await prisma.post.create({
        data: {
          content: post.content,
          mediaUrl: post.mediaUrl,
          authorId: user.id,
        },
      });
      created++;
    }
  }

  console.log(`Seeded ${created} demo posts with media.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
