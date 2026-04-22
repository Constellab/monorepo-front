# Build step
FROM oven/bun:1-alpine AS build

WORKDIR /app

COPY package.json bun.lock ./

RUN bun install --frozen-lockfile

COPY . .

RUN bun run ca-space-front:build-prod

# Run step
FROM nginx:1.30.0-alpine3.23

COPY --from=build /app/dist/apps/ca-space-front/browser /usr/share/nginx/html

COPY apps/ca-space-front/nginx.conf /etc/nginx/conf.d/default.conf

COPY apps/ca-space-front/entrypoint.sh /entrypoint.sh

RUN sed -i -e 's/\r$//' /entrypoint.sh && \
    sed -i -e 's/\r$//' /etc/nginx/conf.d/default.conf && \
    chmod +x /entrypoint.sh
ENTRYPOINT ["/entrypoint.sh"]
CMD ["nginx","-g","daemon off;"]
