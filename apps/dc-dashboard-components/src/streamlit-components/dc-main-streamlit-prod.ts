import { bootstrapApplication } from '@angular/platform-browser';
import { flLoadEnvironmentFromAssets } from '@monorepo/front-core-lib/fl-core';

import { dcAppConfig } from './dc-app.config';
import { DcComponentLoaderProdComponent } from './dc-core/component/dc-component-loader-prod/dc-component-loader-prod.component';
import { environment } from './dc-environment/dc-environment';
import { dcEnvironmentPath, DcEnvironmentSettings } from './dc-environment/dc-environment.class';

/**
 * Component used in production mode to load the dynamic component
 * It is running in the main app (not in the iframe)
 * and it loads the component in the main app
 * when it receives the init message from the iframe
 */
flLoadEnvironmentFromAssets(dcEnvironmentPath).then((env: DcEnvironmentSettings) => {
  environment.settings = env;
  bootstrapApplication(DcComponentLoaderProdComponent, dcAppConfig(env.baseHref)).catch((err) =>
    console.error(err)
  );
});
