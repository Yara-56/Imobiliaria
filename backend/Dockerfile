# 1. Usamos a versão alpine mais recente e estável para reduzir a superfície de ataque
FROM node:20-alpine3.21

# 2. Cybersecurity Hardening: Atualiza o repositório e aplica patches de segurança 
# nos pacotes do SO para resolver vulnerabilidades críticas e altas (CVEs)
RUN apk update && \
    apk upgrade && \
    apk add --no-cache openssl libssl3 libc6-compat

# Define o diretório de trabalho
WORKDIR /app

# 3. Copia apenas os arquivos de dependência primeiro para otimizar o cache
COPY package*.json ./

# Instala dependências de produção de forma segura
RUN npm install --omit=dev --frozen-lockfile

# Copia o restante do código
COPY . .

# 4. Gera o cliente do Prisma (essencial para a conexão com o MongoDB)
RUN npx prisma generate

# Faz o build do código TypeScript para JavaScript (pasta dist)
RUN npm run build

# 5. Cybersecurity: Altera para um usuário sem privilégios (non-root)
# Isso impede que um atacante ganhe controle total do container caso haja uma invasão
USER node

# Porta padrão do seu servidor
EXPOSE 3333

# Executa a aplicação a partir do código compilado
CMD ["node", "dist/main/server.js"]