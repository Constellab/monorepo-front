import { ComponentType } from '@angular/cdk/overlay';
import { ApplicationRef } from '@angular/core';
import { createCustomElement } from '@angular/elements';
import { createApplication } from '@angular/platform-browser';
import { flLoadEnvironmentFromAssets } from '@monorepo/front-core-lib/fl-core';

import { dcAppConfig } from './dc-app.config';
import { DcInputSearchComponent } from './dc-components/dc-input-search/dc-input-search.component';
import { DcSelectResourceComponent } from './dc-components/dc-select-resource/dc-select-resource.component';
import { DcTextEditorComponent } from './dc-components/dc-text-editor/dc-text-editor.component';
import { environment } from './dc-environment/dc-environment';
import { DcEnvironmentSettings } from './dc-environment/dc-environment.class';

let initialized = false;

/**
 * Initialize and register the Angular custom elements.
 * Call this function to enable the web components.
 * Safe to call multiple times - will only initialize once.
 *
 * We set the basePath to './external/gws_plugin' because once downloaded to reflex app,
 * all the assets are available in the 'external/gws_plugin' folder.
 */
export async function dcInitComponents(basePath: string = './external/gws_plugin'): Promise<void> {
  if (initialized) {
    return;
  }
  initialized = true;

  const envPath = 'external/gws_plugin/assets/environment.json';
  const env: DcEnvironmentSettings = await flLoadEnvironmentFromAssets(envPath);
  environment.settings = env;

  const app = await createApplication(dcAppConfig(basePath));

  createCustomElements(DcTextEditorComponent, 'dc-text-editor', app);
  createCustomElements(DcInputSearchComponent, 'dc-input-search', app);
  createCustomElements(DcSelectResourceComponent, 'dc-select-resource', app);
}

function createCustomElements(componentType: ComponentType<any>, tagName: string, app: ApplicationRef): void {
  const appElement = createCustomElement(componentType, {
    injector: app.injector,
  });

  // Register the custom element
  customElements.define(tagName, appElement);
}
