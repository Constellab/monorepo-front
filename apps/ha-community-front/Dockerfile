# Build step
FROM node:22-alpine3.22 AS buildContainer

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run ha-community-front:build-prod

# Production step
FROM node:22-alpine3.22 AS production

WORKDIR /app
# Copy the entry point

COPY apps/ha-community-front/entrypoint.sh /entrypoint.sh

COPY --from=buildContainer /app/dist /app/dist

RUN sed -i -e 's/\r$//' /entrypoint.sh && \
#    sed -i -e 's/\r$//' /etc/nginx/conf.d/default.conf && \
    chmod +x /entrypoint.sh
ENTRYPOINT ["/entrypoint.sh"]

EXPOSE 4000


