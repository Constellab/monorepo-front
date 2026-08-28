# Build step
FROM oven/bun:1-alpine AS build

WORKDIR /app

# The bun image ships `node` as a symlink to bun (/usr/local/bun-node-fallback-bin/node),
# so `node ... nx build` would run the Angular build on JavaScriptCore instead of V8.
# That made the SSR build take ~10 min instead of ~2 and silently ignored the heap cap.
# Installing nodejs puts a real node in /usr/bin, which wins the PATH over the fallback.
RUN apk add --no-cache nodejs

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
