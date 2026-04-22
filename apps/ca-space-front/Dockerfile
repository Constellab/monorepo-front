# Build step
FROM oven/bun:1-alpine AS buildContainer

WORKDIR /app

# Copy package.json
COPY /package.json /bun.lock ./

# Install dependencies
RUN bun install --frozen-lockfile

# Copy the workspace and build the app
COPY . .

RUN bun run ca-space-front:build-prod

# Run step
FROM nginx:alpine

# Get build result
COPY --from=buildContainer /app/dist/apps/ca-space-front/browser /usr/share/nginx/html

# Copy the default nginx.conf
COPY /apps/ca-space-front/nginx.conf /etc/nginx/conf.d/default.conf

# Copy the entry point
COPY apps/ca-space-front/entrypoint.sh /entrypoint.sh

RUN sed -i -e 's/\r$//' /entrypoint.sh && \
    sed -i -e 's/\r$//' /etc/nginx/conf.d/default.conf && \
    chmod +x /entrypoint.sh
ENTRYPOINT ["/entrypoint.sh"]
CMD ["nginx","-g","daemon off;"]

