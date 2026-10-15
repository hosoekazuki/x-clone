# ---- 1. 依存パッケージのインストール ----
FROM node:24-slim AS deps
WORKDIR /app
RUN npm install -g pnpm@12.8.1
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm install --frozen-lockfile

# ---- 2. ビルド ----
FROM deps AS builder
COPY . .
RUN pnpm build

# ---- 3. DBマイグレーション用（drizzle-kit は開発用パッケージなので、本番イメージとは分ける）----
FROM builder AS migrator
CMD ["pnpm", "exec", "drizzle-kit", "migrate"]

# ---- 4. 本番で動かすイメージ（ビルド結果だけを持つ最小構成）----
FROM node:24-slim AS runner
WORKDIR /app
ENV NODE_ENV=production \
    PORT=3000 \
    HOSTNAME=0.0.0.0

COPY --from=builder --chown=node:node /app/.next/standalone ./
COPY --from=builder --chown=node:node /app/.next/static ./.next/static
COPY --from=builder --chown=node:node /app/public ./public

# rootではなく、権限の少ない node ユーザーでアプリを動かす
USER node
EXPOSE 3000
CMD ["node", "server.js"]
