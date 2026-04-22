# Build step
FROM oven/bun:1-alpine AS buildContainer

WORKDIR /app

# Copy package.json
COPY /package.json /bun.lock ./

# Install dependencies
RUN bun install --frozen-lockfile

# Copy the workspace and build the app
COPY . .

RUN bun run lab-manager-standalone:build-prod

# Run step
FROM nginx:alpine

# Get build result
COPY --from=buildContainer /app/dist/apps/lab-manager-standalone/browser /usr/share/nginx/html

# Copy the default nginx.conf as a template (envsubst will generate default.conf at runtime)
COPY /apps/lab-manager-standalone/nginx.conf /etc/nginx/conf.d/nginx.template

# Copy the entry point
COPY apps/lab-manager-standalone/entrypoint.sh /entrypoint.sh

RUN sed -i -e 's/\r$//' /entrypoint.sh && \
    sed -i -e 's/\r$//' /etc/nginx/conf.d/default.conf && \
    chmod +x /entrypoint.sh
ENTRYPOINT ["/entrypoint.sh"]
CMD ["nginx","-g","daemon off;"]

