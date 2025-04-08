import { bootstrapApplication } from '@angular/platform-browser';
import { dcStreamlitComponentsConfig } from './dc-streamlit-components-app.config';
import { DcComponentLoaderIframeDevComponent } from './dc-core/component/dc-component-loader-iframe-dev/dc-component-loader-iframe-dev.component';

bootstrapApplication(DcComponentLoaderIframeDevComponent, dcStreamlitComponentsConfig('')).catch((err) =>
  console.error(err)
);
