/**
 * Interface for environment,
 */
export interface HaEnvironment {
  // true if the app is compiled in prod mode
  production: boolean;

  settings: HaEnvironmentSettings;
}

/**
 * Environment information that are dynamically loaded form a json
 * file in the asset in prod mode
 */
export interface HaEnvironmentSettings {
  // base url for the api
  apiUrl: string;

  // base url for the constellab api
  constellabApiUrl: string;

  // url for constellab
  constellabFrontUrl: string;

  // front url
  communityFrontUrl: string;

  // recaptcha site key
  captchaSiteKey: string;

  //google analytics id
  googleAnalyticsId: string;

  discordLink: string;

  algoliaAppId: string;

  algoliaSearchKey: string;

  algoliaIndexName: string;

  algoliaSiteVerificationKey: string | null;

  homeVideoLink: string | null;
}

// Path of the environment json file created during the docker run (used in production)
export const HA_ENVIRONMENT_PATH: string = 'assets/environment.json';
