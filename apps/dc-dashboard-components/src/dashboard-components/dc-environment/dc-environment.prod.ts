import { DcEnvironment } from './dc-environment.class';

/**
 * This file is just to define the skeleton for prod environment and set production to True
 * The content is overwritten on app load by {@link flLoadEnvironmentFromAssets} that uses a json file
 * in the assets
 *
 * NEVER IMPORT THIS FILE FROM ANOTHER FILE
 */
export const DC_ENVIRONMENT: DcEnvironment = {
  production: true,
  settings: {
    apiBaseUrl: '',
    baseHref: '',
    spaceApiUrl: '',
    spaceFrontUrl: '',
    communityFrontUrl: '',
    communityApiUrl: '',
  },
};
