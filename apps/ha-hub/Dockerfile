# Build step
FROM node:18-alpine3.17 as buildContainer

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run ha-hub:build-prod

RUN npm run ha-hub:build-prod-ssr

FROM node:18-alpine3.17 as production

WORKDIR /app
# Copy the entry point
COPY apps/ha-hub/entrypoint.sh /entrypoint.sh

COPY package*.json ./

RUN npm ci --production

COPY --from=buildContainer /app/dist ./dist

EXPOSE 4000

RUN sed -i -e 's/\r$//' /entrypoint.sh && \
#    sed -i -e 's/\r$//' /etc/nginx/conf.d/default.conf && \
    chmod +x /entrypoint.sh

ENTRYPOINT ["/entrypoint.sh"]

CMD ["node", "dist/apps/ha-hub/server/main"]
