import { ComponentType } from '@angular/cdk/overlay';
import { ApplicationRef } from '@angular/core';
import { createCustomElement } from '@angular/elements';
import { bootstrapApplication } from '@angular/platform-browser';

import { dcAppConfig } from './dc-app.config';
import { DcInputSearchComponent } from './dc-components/dc-input-search/dc-input-search.component';
import { DcSelectResourceComponent } from './dc-components/dc-select-resource/dc-select-resource.component';
import { DcTextEditorComponent } from './dc-components/dc-text-editor/dc-text-editor.component';
import { DcComponentLoaderDevComponent } from './dc-core/component/dc-component-loader-dev/dc-component-loader-dev.component';
import { DC_DEV_ROUTES } from './dc-core/component/dc-component-loader-dev/dc-dev.routes';

/**
 * Use to dev on component without the streamlit server in standalone mode
 */
bootstrapApplication(DcComponentLoaderDevComponent, dcAppConfig('', DC_DEV_ROUTES))
  .then((app) => {
    // use other name for the tag to avoid conflict with the component selector used in streamlit app
    createCustomElements(DcTextEditorComponent, 'custom-text-editor', app);
    createCustomElements(DcInputSearchComponent, 'custom-input-search', app);
    createCustomElements(DcSelectResourceComponent, 'custom-select-resource', app);
  })
  .catch((err) => console.error(err));

function createCustomElements(componentType: ComponentType<any>, tagName: string, app: ApplicationRef): void {
  const appElement = createCustomElement(componentType, {
    injector: app.injector,
  });

  // Register the custom element
  customElements.define(tagName, appElement);
}
