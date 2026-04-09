# --- BUILD ---
    FROM node:20-bookworm-slim AS builder

    WORKDIR /app
    
    RUN apt-get update && apt-get upgrade -y && rm -rf /var/lib/apt/lists/*
    
    COPY package.json pnpm-lock.yaml ./
    COPY prisma ./prisma/
    
    RUN npm install -g pnpm
    RUN pnpm install --frozen-lockfile
    
    COPY . .
    
    RUN npx prisma generate
    RUN pnpm build
    
    # --- RUNTIME ---
    FROM gcr.io/distroless/nodejs20-debian12
    
    WORKDIR /app
    
    COPY --from=builder /app/node_modules ./node_modules
    COPY --from=builder /app/dist ./dist
    COPY --from=builder /app/prisma ./prisma
    
    ENV NODE_ENV=production
    ENV PORT=3333
    
    EXPOSE 3333
    
    CMD ["dist/main/server.js"]