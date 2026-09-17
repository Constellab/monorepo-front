#!/bin/sh

# Entry point of the docker file
# Create the environment.json file from env variables
echo "{\"apiUrl\" : \"$API_URL\",  \"communityApiUrl\" : \"$COMMUNITY_API_URL\", \"communityFrontUrl\" : \"$COMMUNITY_FRONT_URL\", \"frontDomain\" : \"$FRONT_DOMAIN\", \"captchaSiteKey\" : \"$CAPTCHA_SITE_KEY\"}" > /usr/share/nginx/html/assets/environment.json

# Domains allowed in the Content-Security-Policy, overridable at run time.
# Keep the historical domains as the default so an existing deployment keeps working
# without setting anything.
export CSP_ALLOWED_DOMAINS="${CSP_ALLOWED_DOMAINS:-*.preconstellab.com *.constellab.space *.gencovery.com}"

# Domain of the constellab community, used in connect-src as a plain host source and as a
# wss:// one (the socket of the community AI assistant). A single domain, not a list: the
# template prefixes it with wss:// on its own.
export COMMUNITY_CSP_ALLOWED_DOMAIN="${COMMUNITY_CSP_ALLOWED_DOMAIN:-*.constellab.community}"

# Replace the variables in the nginx template file and create the nginx configuration file.
# The variable list is mandatory: without it envsubst would also expand the nginx variables
# of the template ($uri, ${DEFAULT_SRC}, ...) and empty the configuration.
envsubst '${CSP_ALLOWED_DOMAINS} ${COMMUNITY_CSP_ALLOWED_DOMAIN}' < /etc/nginx/conf.d/nginx.template > /etc/nginx/conf.d/default.conf

# Execute the nginx docker entry point
. /docker-entrypoint.sh
