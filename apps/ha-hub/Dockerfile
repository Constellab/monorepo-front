# Build step
FROM node:18-alpine3.17 as buildContainer

WORKDIR /app

## Copy package.json
COPY /package.json /package-lock.json ./
#
## Install dependencies
RUN npm install
#
## Copy the workspace and build the app
COPY . .
#
RUN npm run ha-hub:build-ssr

COPY /dist/apps/ha-hub/ /app/dist/apps/ha-hub/

# Copy the entry point
COPY apps/ha-hub/entrypoint.sh /entrypoint.sh

RUN sed -i -e 's/\r$//' /entrypoint.sh && \
#    sed -i -e 's/\r$//' /etc/nginx/conf.d/default.conf && \
    chmod +x /entrypoint.sh

ENTRYPOINT ["/entrypoint.sh"]
