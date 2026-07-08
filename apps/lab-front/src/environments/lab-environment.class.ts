/**
 * Interface for environment,
 */
export interface LabEnvironment {
  // true if the app is compiled in prod mode
  production: boolean;

  settings: LabEnvironmentSettings;
}

/**
 * Environment information that are dynamically loaded form a json
 * file in the asset in prod mode
 */
export interface LabEnvironmentSettings {
  // base url for the api
  apiBaseUrl: string;

  // base url for the api in dev environment
  devApiBaseUrl: string;

  // url for the codelab
  codelabUrl: string;

  // domain name of the server
  virtualHost: string;

  // url of the space front
  spaceFrontUrl: string;

  // url of the space api
  spaceApiUrl: string;

  // url of the community front
  communityFrontUrl: string;

  // url of the community api
  communityApiUrl: string;

  // captcha site key
  captchaSiteKey: string;

  // url of the prod front
  prodFrontUrls: string;

  // url of the dev front
  devFrontUrls: string;
}

// Path of the environment json file created during the docker run (used in production)
export const LAB_ENVIRONMENT_PATH: string = 'assets/environment.json';
