# Build step
FROM node:22-alpine3.22 AS buildContainer

WORKDIR /app

# Copy package.json
COPY /package.json /package-lock.json ./

# Install dependencies
RUN npm ci

# Copy the workspace and build the app
COPY . .

RUN npm run lab-manager-standalone:build-prod

# Run step
FROM nginx:alpine

# Get build result
COPY --from=buildContainer /app/dist/apps/lab-manager-standalone/browser /usr/share/nginx/html

# Copy the default nginx.conf
COPY /apps/lab-manager-standalone/nginx.conf /etc/nginx/conf.d/default.conf

# Copy the entry point
COPY apps/lab-manager-standalone/entrypoint.sh /entrypoint.sh

RUN sed -i -e 's/\r$//' /entrypoint.sh && \
    sed -i -e 's/\r$//' /etc/nginx/conf.d/default.conf && \
    chmod +x /entrypoint.sh
ENTRYPOINT ["/entrypoint.sh"]
CMD ["nginx","-g","daemon off;"]

