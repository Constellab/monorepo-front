#!/bin/sh

# Entry point of the docker file
# Create the environment.json file from env variables
echo "{\"apiUrl\" : \"$API_URL\",  \"communityApiUrl\" : \"$COMMUNITY_API_URL\", \"communityFrontUrl\" : \"$COMMUNITY_FRONT_URL\"}" > /usr/share/nginx/html/assets/environment.json

# Set VIRTUAL_HOST_DOMAIN based on VIRTUAL_HOST env var
if [ -n "$VIRTUAL_HOST" ]; then
  export VIRTUAL_HOST_DOMAIN_VALUE="*.$VIRTUAL_HOST"
else
  export VIRTUAL_HOST_DOMAIN_VALUE=""
fi

# Constellab and community domains allowed in the Content-Security-Policy, overridable at
# run time. The lab own domain comes from VIRTUAL_HOST above, not from this list.
export CSP_ALLOWED_DOMAINS="${CSP_ALLOWED_DOMAINS:-*.preconstellab.com *.constellab.space *.constellab.community}"

# Replace the variables in the nginx template file and create the nginx configuration file
envsubst '${VIRTUAL_HOST_DOMAIN_VALUE} ${CSP_ALLOWED_DOMAINS}' < /etc/nginx/conf.d/nginx.template > /etc/nginx/conf.d/default.conf

# Execute the nginx docker entry point
. /docker-entrypoint.sh
