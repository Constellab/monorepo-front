import { bootstrapApplication } from '@angular/platform-browser';
import { dcStreamlitComponentsConfig } from './dc-streamlit-components-app.config';
import { DcComponentLoaderIframeDevComponent } from './dc-core/component/dc-component-loader-iframe-dev/dc-component-loader-iframe-dev.component';

/**
 * run in the component in iframe in dev mode.
 * This is used when you want to test a component in dev mode in a streamlit app.
 */
bootstrapApplication(DcComponentLoaderIframeDevComponent, dcStreamlitComponentsConfig('')).catch((err) =>
  console.error(err)
);
