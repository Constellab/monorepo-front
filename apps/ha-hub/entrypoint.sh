#!/bin/sh

# Entry point of the docker file
# Create the environment.json file from env variables
echo "{\"apiUrl\" : \"$API_URL\",  \"constellabApiUrl\" : \"$CONSTELLAB_API_URL\", \"constellabFrontUrl\" : \"$CONSTELLAB_FRONT_URL\", \"communityFrontUrl\" : \"$COMMUNITY_FRONT_URL\", \"captchaSiteKey\" : \"$CAPTCHA_SITE_KEY\", \"googleAnalyticsId\" : \"$GOOGLE_ANALYTICS_ID\", \"discordLink\" : \"$DISCORD_LINK\", \"algoliaAppId\" : \"$ALGOLIA_APP_ID\", \"algoliaSearchKey\" : \"$ALGOLIA_SEARCH_KEY\", \"algoliaSiteVerificationKey\" : \"$ALGOLIA_SITE_VERIFICATION_KEY\", \"algoliaIndexName\" : \"$ALGOLIA_INDEX_NAME\"}" > /app/dist/apps/ha-hub/browser/assets/environment.json


# Execute the nginx docker entry point
node /app/dist/apps/ha-hub/server/server.mjs



