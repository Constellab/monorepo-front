// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

import {CaEnvironment} from './ca-environment.class';

/**
 * File for local environment, env is defined in main file.
 * The environment is not accessible in forRoot method of the module, need to use provider
 *
 * NEVER IMPORT ENVIRONMENT DIRECTLY FORM HERE, USE ENVIRONMENT HELPER INSTEAD
 */
export const environment: CaEnvironment = {
  production: false,
  settings: {
    apiUrl: '',
    communityApiUrl: '',
    communityFrontUrl: '',
    frontDomain: '',
    captchaSiteKey: ''
  }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
