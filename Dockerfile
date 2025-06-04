FROM node:22-alpine AS base
RUN npm i -g pnpm@latest

FROM base AS builder
WORKDIR /usr/src/app

# Token GitHub pour GitHub Packages (via ARG pour build local ou GitHub Actions)
ARG GITHUB_TOKEN
ENV GITHUB_TOKEN=$GITHUB_TOKEN

# Injecte token dans .npmrc
RUN echo "@kascad-app:registry=https://npm.pkg.github.com" > .npmrc \
  && echo "//npm.pkg.github.com/:_authToken=${GITHUB_TOKEN}" >> .npmrc

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile && rm .npmrc

COPY . .
RUN pnpm build

FROM base AS production
WORKDIR /usr/src/app

ARG GITHUB_TOKEN
ENV GITHUB_TOKEN=$GITHUB_TOKEN

RUN echo "@kascad-app:registry=https://npm.pkg.github.com" > .npmrc \
  && echo "//npm.pkg.github.com/:_authToken=${GITHUB_TOKEN}" >> .npmrc

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --prod --frozen-lockfile && rm .npmrc

# Copie des fichiers nécessaires pour Next.js
COPY --from=builder /usr/src/app/.next ./.next
COPY --from=builder /usr/src/app/public ./public
COPY --from=builder /usr/src/app/next.config.js ./
COPY --from=builder /usr/src/app/package.json ./

COPY .env .env

USER node

EXPOSE 3000

ENV NODE_ENV=production
ENV PORT=3000

CMD ["pnpm", "start"]
