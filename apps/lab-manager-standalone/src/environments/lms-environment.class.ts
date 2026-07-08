/**
 * Interface for environment,
 */
export interface LmsEnvironment {
  // true if the app is compiled in prod mode
  production: boolean;

  settings: LmsEnvironmentSettings;
}

/**
 * Environment information that are dynamically loaded form a json
 * file in the asset in prod mode
 */
export interface LmsEnvironmentSettings {
  // base url for the api
  apiUrl: string;

  // base url for the community api
  communityApiUrl: string;

  // url for community
  communityFrontUrl: string;
}

// Path of the environment json file created during the docker run (used in production)
export const LMS_ENVIRONMENT_PATH: string = 'assets/environment.json';
