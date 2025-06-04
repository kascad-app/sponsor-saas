# ---- Base image ----
FROM node:22-alpine AS base
RUN npm i -g pnpm@latest

# ---- Dependencies only ----
FROM base AS deps
WORKDIR /app

ARG GITHUB_TOKEN
ENV GITHUB_TOKEN=$GITHUB_TOKEN

# Auth to GitHub Packages
RUN echo "@kascad-app:registry=https://npm.pkg.github.com" > .npmrc \
  && echo "//npm.pkg.github.com/:_authToken=${GITHUB_TOKEN}" >> .npmrc

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile && rm .npmrc

# ---- Build stage ----
FROM base AS builder
WORKDIR /app

ARG GITHUB_TOKEN
ENV GITHUB_TOKEN=$GITHUB_TOKEN

COPY --from=deps /app/node_modules ./node_modules
COPY . .

 COPY .env .env

RUN pnpm build

# ---- Production stage ----
FROM base AS production
WORKDIR /app

COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

COPY .env .env

EXPOSE 3000
CMD ["pnpm", "start"]
