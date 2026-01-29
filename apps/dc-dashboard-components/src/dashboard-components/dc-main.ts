import { bootstrapApplication } from '@angular/platform-browser';

import { dcAppConfig } from './dc-app.config';
import { DcComponentLoaderDevComponent } from './dc-core/component/dc-component-loader-dev/dc-component-loader-dev.component';
import { DC_DEV_ROUTES } from './dc-core/component/dc-component-loader-dev/dc-dev.routes';

/**
 * Use to dev on component without the streamlit server in standalone mode
 */
bootstrapApplication(DcComponentLoaderDevComponent, dcAppConfig('', DC_DEV_ROUTES)).catch((err) =>
  console.error(err)
);
