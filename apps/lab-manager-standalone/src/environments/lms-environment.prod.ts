// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

import { LmsEnvironment } from './lms-environment.class';

/**
 * File for local environment, env is defined in main file.
 * The environment is not accessible in forRoot method of the module, need to use provider
 *
 * NEVER IMPORT ENVIRONMENT DIRECTLY FORM HERE, USE ENVIRONMENT HELPER INSTEAD
 */
export const LMS_ENVIRONMENT: LmsEnvironment = {
  production: true,
  settings: {
    apiUrl: '',
    communityApiUrl: '',
    communityFrontUrl: '',
  },
};
