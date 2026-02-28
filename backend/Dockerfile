# 1. Mudamos para uma imagem com menos vulnerabilidades conhecidas (Slim)
FROM node:20-bookworm-slim

# 2. Hardening para Debian/Slim
RUN apt-get update && apt-get upgrade -y && \
    apt-get install -y --no-install-recommends openssl libssl3 ca-certificates && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# O restante do seu código continua quase igual...
WORKDIR /app
COPY package*.json ./

# DICA: Se você usa o Prisma, você precisa das dependências de build aqui
RUN npm ci --omit=dev

COPY . .
RUN npx prisma generate
RUN npm run build

USER node
EXPOSE 3333
CMD ["node", "dist/main/server.js"]