# Build step
FROM oven/bun:1-alpine AS build

WORKDIR /app

COPY package.json bun.lock ./

RUN bun install --frozen-lockfile

COPY . .

RUN bun run lab-manager-standalone:build-prod

# Run step
FROM nginx:1.30.0-alpine3.23

COPY --from=build /app/dist/apps/lab-manager-standalone/browser /usr/share/nginx/html

COPY apps/lab-manager-standalone/nginx.conf /etc/nginx/conf.d/nginx.template

COPY apps/lab-manager-standalone/entrypoint.sh /entrypoint.sh

RUN sed -i -e 's/\r$//' /entrypoint.sh && \
    chmod +x /entrypoint.sh
ENTRYPOINT ["/entrypoint.sh"]
CMD ["nginx","-g","daemon off;"]
