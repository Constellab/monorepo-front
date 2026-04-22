# Build step
FROM oven/bun:1-alpine AS build_container

WORKDIR /app

COPY package.json bun.lock ./

RUN bun install --frozen-lockfile

COPY . .

RUN bun run ha-community-front:build-prod

# Production step
FROM oven/bun:1-alpine AS production

WORKDIR /app
# Copy the entry point

COPY apps/ha-community-front/entrypoint.sh /entrypoint.sh

COPY --from=build_container /app/dist /app/dist

RUN sed -i -e 's/\r$//' /entrypoint.sh && \
#    sed -i -e 's/\r$//' /etc/nginx/conf.d/default.conf && \
    chmod +x /entrypoint.sh
ENTRYPOINT ["/entrypoint.sh"]

EXPOSE 4000


