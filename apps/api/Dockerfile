FROM node:22-slim AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY tsconfig.json ./
COPY prisma ./prisma
COPY src ./src

RUN npx prisma generate
RUN npx tsc -p tsconfig.json

FROM node:22-slim

WORKDIR /app

COPY package*.json ./
RUN npm install --omit=dev
RUN npx prisma generate

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma

EXPOSE 4001

CMD ["sh", "-c", "npx prisma migrate deploy && node dist/server.js"]
