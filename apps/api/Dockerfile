FROM node:22-slim

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY tsconfig.json ./
COPY prisma ./prisma
COPY prisma.config.ts ./
COPY src ./src

RUN npx prisma generate

EXPOSE 4000

CMD ["npm", "run", "dev"]