# Build step
FROM oven/bun:1-alpine AS build

WORKDIR /app

COPY package.json bun.lock ./

RUN bun install --frozen-lockfile

COPY . .

RUN bun run lab-front:build-prod

# Run step
FROM nginx:1.30.0-alpine3.23

COPY --from=build /app/dist/apps/lab-front/browser /usr/share/nginx/html

COPY apps/lab-front/nginx.conf /etc/nginx/conf.d/nginx.template

COPY apps/lab-front/entrypoint.sh /entrypoint.sh

EXPOSE 81

RUN sed -i -e 's/\r$//' /entrypoint.sh && \
    chmod +x /entrypoint.sh
ENTRYPOINT ["/entrypoint.sh"]
CMD ["nginx","-g","daemon off;"]
