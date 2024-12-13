# Build step
FROM node:20-alpine3.20 AS buildContainer

WORKDIR /app

# Copy package.json
COPY /package.json /package-lock.json ./

# Install dependencies
RUN npm ci

# Copy the workspace and build the app
COPY . .

RUN npm run lab-front:build-prod

FROM nginx:alpine
# Copy the dist lab-front
COPY --from=buildContainer /app/dist/apps/lab-front/browser /usr/share/nginx/html

# Copy the default nginx.conf
COPY apps/lab-front/nginx.conf /etc/nginx/conf.d/nginx.template

# Copy the entry point
COPY apps/lab-front/entrypoint.sh /entrypoint.sh

# Expose the 81 port, use expose because in prod we use a specific nginx server that
# does not work with port but expose
EXPOSE 81

RUN sed -i -e 's/\r$//' /entrypoint.sh && \
    sed -i -e 's/\r$//' /etc/nginx/conf.d/default.conf && \
    chmod +x /entrypoint.sh
ENTRYPOINT ["/entrypoint.sh"]
CMD ["nginx","-g","daemon off;"]

## Code for local test to use when app is already build and just transfered to the container
## Need to command the dist folder in the .dockerignore file

## LEAVE THIS CODE COMMENTED
#FROM nginx:alpine
## Copy the dist lab-front
#COPY dist/apps/lab-front /usr/share/nginx/html
#
## Copy the default nginx.conf
#COPY apps/lab-front/nginx.conf /etc/nginx/conf.d/nginx.template
#
## Copy the entry point
#COPY apps/lab-front/entrypoint.sh /entrypoint.sh
#
## Expose the 81 port, use expose because in prod we use a specific nginx server that
## does not work with port but expose
#EXPOSE 81
#
#RUN sed -i -e 's/\r$//' /entrypoint.sh && \
#    sed -i -e 's/\r$//' /etc/nginx/conf.d/default.conf && \
#    chmod +x /entrypoint.sh
#ENTRYPOINT ["/entrypoint.sh"]
#CMD ["nginx","-g","daemon off;"]
