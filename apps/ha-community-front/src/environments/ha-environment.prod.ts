import { HaEnvironment } from './ha-environment.class';

/**
 * This file is just to define the skeleton for prod environment and set production to True
 * The content is overwritten on app load by {@link flLoadEnvironmentFromAssets} that uses a json file
 * in the assets
 *
 * NEVER IMPORT THIS FILE FROM ANOTHER FILE
 */
export const environment: HaEnvironment = {
  production: true,
  settings: {
    apiUrl: 'http://localhost:3333',
    constellabApiUrl: '',
    constellabFrontUrl: '',
    communityFrontUrl: '',
    captchaSiteKey: '',
    googleAnalyticsId: '',
    discordLink: '',
    algoliaAppId: '',
    algoliaSearchKey: '',
    algoliaIndexName: '',
    algoliaSiteVerificationKey: '',
    difyChatbotToken: ''
  },
};
