# --- ESTÁGIO 1: BUILD ---
    FROM node:20-alpine AS builder

    RUN apk add --no-cache openssl libc6-compat
    
    WORKDIR /app
    
    COPY package*.json ./
    COPY prisma ./prisma/
    
    RUN npm ci
    
    COPY . .
    
    RUN npx prisma generate
    RUN npm run build
    
    # --- ESTÁGIO 2: RUNTIME ---
    FROM node:20-alpine AS runner
    
    RUN apk add --no-cache openssl ca-certificates libc6-compat
    
    WORKDIR /app
    
    COPY --from=builder /app/package*.json ./
    COPY --from=builder /app/node_modules ./node_modules
    COPY --from=builder /app/dist ./dist
    COPY --from=builder /app/prisma ./prisma
    
    USER node
    
    ENV NODE_ENV=production
    ENV PORT=3333
    
    EXPOSE 3333
    
    CMD ["node", "dist/main/server.js"]