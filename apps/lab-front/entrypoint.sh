#!/bin/sh

# Entry point of the docker file
# Create the environment.json file from env variables
echo "{\"apiBaseUrl\" : \"$API_URL\",  \"devApiBaseUrl\" : \"$LAB_DEV_API_URL\", \"codelabUrl\" : \"$CODELAB_URL\", \"virtualHost\" : \"$VIRTUAL_HOST\",  \"spaceFrontUrl\" : \"$SPACE_FRONT_URL\", \"spaceApiUrl\" : \"$SPACE_API_URL\",  \"communityFrontUrl\" : \"$COMMUNITY_FRONT_URL\",  \"communityApiUrl\" : \"$COMMUNITY_API_URL\", \"captchaSiteKey\" : \"$CAPTCHA_SITE_KEY\", \"prodFrontUrls\" : \"$PROD_FRONT_URLS\", \"devFrontUrls\" : \"$DEV_FRONT_URLS\"}" > /usr/share/nginx/html/assets/environment.json

# Set VIRTUAL_HOST_DOMAIN based on VIRTUAL_HOST env var
if [ -n "$VIRTUAL_HOST" ]; then
  export VIRTUAL_HOST_DOMAIN_VALUE="*.$VIRTUAL_HOST"
else
  export VIRTUAL_HOST_DOMAIN_VALUE=""
fi

# Additional domains allowed in the Content-Security-Policy (connect-src and media-src),
# overridable at run time. The lab own domain comes from VIRTUAL_HOST above, not from this
# list. Keep the historical domains as the default so an existing deployment keeps working
# without setting anything.
export CSP_ALLOWED_DOMAINS="${CSP_ALLOWED_DOMAINS:-*.preconstellab.com *.constellab.space *.gencovery.com}"

# Domain of the constellab community, used in connect-src as a plain host source and as a
# wss:// one (the socket of the community AI assistant). A single domain, not a list: the
# template prefixes it with wss:// on its own.
export COMMUNITY_CSP_ALLOWED_DOMAIN="${COMMUNITY_CSP_ALLOWED_DOMAIN:-*.constellab.community}"

# Replace the variables in the nginx template file and create the nginx configuration file.
# The variable list is mandatory: without it envsubst would also expand the nginx variables
# of the template ($uri, ${DEFAULT_SRC}, ...) and empty the configuration.
envsubst '${VIRTUAL_HOST_DOMAIN_VALUE} ${CSP_ALLOWED_DOMAINS} ${COMMUNITY_CSP_ALLOWED_DOMAIN}' < /etc/nginx/conf.d/nginx.template > /etc/nginx/conf.d/default.conf

# Execute the nginx docker entry point
. /docker-entrypoint.sh
