import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";

import { prisma } from "./prisma.js";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),

  emailAndPassword: {
    enabled: true,
  },

  user: {
    additionalFields: {
      username: {
        type: "string",
        required: false,
        unique: false,
      },
      bio: {
        type: "string",
        required: false,
      },
    },
  },

  trustedOrigins: [process.env.FRONTEND_URL || "http://localhost:3000"],
  baseURL: process.env.BETTER_AUTH_URL || "http://localhost:4001",
  secret: process.env.BETTER_AUTH_SECRET || "fallback-secret-change-me",
});