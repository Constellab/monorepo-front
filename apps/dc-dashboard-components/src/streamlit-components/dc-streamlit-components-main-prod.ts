import { bootstrapApplication } from '@angular/platform-browser';
import { dcStreamlitComponentsConfig } from './dc-streamlit-components-app.config';
import { DcComponentLoaderProdComponent } from './dc-core/component/dc-component-loader-prod/dc-component-loader-prod.component';
import { flLoadEnvironmentFromAssets } from '@monorepo/front-core-lib/fl-core';
import { dcEnvironmentPath, DcEnvironmentSettings } from './dc-environment/dc-environment.class';
import { environment } from './dc-environment/dc-environment';

flLoadEnvironmentFromAssets(dcEnvironmentPath).then((env: DcEnvironmentSettings) => {
  environment.settings = env;
  bootstrapApplication(DcComponentLoaderProdComponent, dcStreamlitComponentsConfig(env.baseHref)).catch(
    (err) => console.error(err)
  );
});
