# Build step
FROM oven/bun:1-alpine AS build

WORKDIR /app

COPY package.json bun.lock ./

RUN bun install --frozen-lockfile

COPY . .

RUN bun run ha-community-front:build-prod

# Production step
FROM oven/bun:1-alpine AS production

WORKDIR /app

COPY apps/ha-community-front/entrypoint.sh /entrypoint.sh

COPY --from=build /app/dist /app/dist

RUN sed -i -e 's/\r$//' /entrypoint.sh && \
    chmod +x /entrypoint.sh
ENTRYPOINT ["/entrypoint.sh"]

EXPOSE 4000
