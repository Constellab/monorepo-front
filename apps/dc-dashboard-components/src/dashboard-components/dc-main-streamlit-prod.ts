import { bootstrapApplication } from '@angular/platform-browser';
import { flLoadEnvironmentFromAssets } from '@monorepo/front-core-lib/fl-core';

import { dcAppConfig } from './dc-app.config';
import { DcComponentLoaderProdComponent } from './dc-core/component/dc-component-loader-prod/dc-component-loader-prod.component';
import { DC_ENVIRONMENT } from './dc-environment/dc-environment';
import { DC_ENVIRONMENT_PATH, DcEnvironmentSettings } from './dc-environment/dc-environment.class';

/**
 * Component used in production mode to load the dynamic component
 * It is running in the main app (not in the iframe)
 * and it loads the component in the main app
 * when it receives the init message from the iframe
 */
flLoadEnvironmentFromAssets(DC_ENVIRONMENT_PATH).then((env: DcEnvironmentSettings) => {
  DC_ENVIRONMENT.settings = env;
  bootstrapApplication(DcComponentLoaderProdComponent, dcAppConfig(env.baseHref)).catch((err) =>
    console.error(err)
  );
});
