/**
 * Interface for environment,
 */
export interface DcEnvironment {
  // true if the app is compiled in prod mode
  production: boolean;

  settings: DcEnvironmentSettings;
}

/**
 * Environment information that are dynamically loaded form a json
 * file in the asset in prod mode
 */
export interface DcEnvironmentSettings {
  // base url for the api
  apiBaseUrl: string;

  spaceApiUrl: string;

  spaceFrontUrl: string;

  communityFrontUrl: string;

  communityApiUrl: string;

  baseHref: string;
}

// Path of the environment json file created during the docker run (used in production)
export const DC_ENVIRONMENT_PATH: string = 'static/gws_plugin/assets/environment.json';
