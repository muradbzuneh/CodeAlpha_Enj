FROM node:22-slim AS builder

WORKDIR /app

COPY package*.json ./
COPY apps/api/package*.json ./apps/api/
RUN npm install

COPY apps/api/tsconfig.json ./apps/api/
COPY apps/api/prisma ./apps/api/prisma
COPY apps/api/src ./apps/api/src

RUN npx prisma generate --schema=apps/api/prisma/schema.prisma
RUN cd apps/api && npx tsc -p tsconfig.json

FROM node:22-slim

WORKDIR /app

COPY package*.json ./
COPY apps/api/package*.json ./apps/api/
RUN npm install --omit=dev
RUN npm install prisma --save-dev

COPY --from=builder /app/apps/api/dist ./apps/api/dist
COPY --from=builder /app/apps/api/prisma ./apps/api/prisma
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma
COPY --from=builder /app/node_modules/.bin ./node_modules/.bin

EXPOSE 4001

CMD ["sh", "-c", "cd apps/api && npx prisma migrate deploy && cd /app && node apps/api/dist/server.js"]
