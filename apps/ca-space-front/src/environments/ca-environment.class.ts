/**
 * Interface for environment,
 */
export interface CaEnvironment {
  // true if the app is compiled in prod mode
  production: boolean;

  settings: CaEnvironmentSettings;
}

/**
 * Environment information that are dynamically loaded form a json
 * file in the asset in prod mode
 */
export interface CaEnvironmentSettings {
  // base url for the api
  apiUrl: string;

  // base url for the community api
  communityApiUrl: string;

  // url for the community
  communityFrontUrl: string;

  // domain name of the server
  frontDomain: string;

  // recaptcha site key
  captchaSiteKey: string;
}

// Path of the environment json file created during the docker run (used in production)
export const CA_ENVIRONMENT_PATH: string = 'assets/environment.json';
