#!/bin/sh

# Entry point of the docker file
# Create the environment.json file from env variables
echo "{\"apiBaseUrl\" : \"$API_URL\",  \"devApiBaseUrl\" : \"$LAB_DEV_API_URL\", \"codelabUrl\" : \"$CODELAB_URL\", \"virtualHost\" : \"$VIRTUAL_HOST\",  \"spaceFrontUrl\" : \"$SPACE_FRONT_URL\", \"spaceApiUrl\" : \"$SPACE_API_URL\",  \"communityFrontUrl\" : \"$COMMUNITY_FRONT_URL\",  \"communityApiUrl\" : \"$COMMUNITY_API_URL\", \"captchaSiteKey\" : \"$CAPTCHA_SITE_KEY\", \"prodFrontUrls\" : \"$PROD_FRONT_URLS\", \"devFrontUrls\" : \"$DEV_FRONT_URLS\"}" > /usr/share/nginx/html/assets/environment.json

# Replace the variable in the nginx template file and create the nginx configuration file
envsubst '${VIRTUAL_HOST}' < /etc/nginx/conf.d/nginx.template > /etc/nginx/conf.d/default.conf

# Execute the nginx docker entry point
. /docker-entrypoint.sh
