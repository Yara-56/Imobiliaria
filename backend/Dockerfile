# --- ESTÁGIO 1: BUILD ---
    FROM node:20-alpine AS builder

    # Instala apenas o necessário para o Prisma e o build no Alpine
    RUN apk add --no-cache openssl libc6-compat
    
    WORKDIR /app
    
    COPY package*.json ./
    COPY prisma ./prisma/
    
    # Instalamos todas as dependências (incluindo as de build)
    RUN npm ci
    
    COPY . .
    RUN npx prisma generate
    RUN npm run build
    
    # --- ESTÁGIO 2: RUNTIME (Imagem Final Limpa) ---
    FROM node:20-alpine AS runner
    
    # Atualiza pacotes e instala bibliotecas mínimas de runtime
    RUN apk update && apk upgrade && \
        apk add --no-cache openssl ca-certificates libc6-compat && \
        rm -rf /var/cache/apk/*
    
    WORKDIR /app
    
    # Copiamos apenas o estritamente necessário
    COPY --from=builder /app/package*.json ./
    COPY --from=builder /app/dist ./dist
    COPY --from=builder /app/node_modules ./node_modules
    COPY --from=builder /app/prisma ./prisma
    
    # Segurança: Nunca rode como root em produção
    USER node
    
    ENV NODE_ENV=production
    ENV PORT=3333
    
    EXPOSE 3333
    
    CMD ["node", "dist/main/server.js"]