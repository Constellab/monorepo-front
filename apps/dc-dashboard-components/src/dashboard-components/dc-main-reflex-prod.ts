import { ComponentType } from '@angular/cdk/overlay';
import { ApplicationRef } from '@angular/core';
import { createCustomElement } from '@angular/elements';
import { createApplication } from '@angular/platform-browser';

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
 * The default base path is root-absolute ('/external/gws_plugin'), i.e. resolved from the origin
 * root regardless of the current route. The host reflex app is served at the origin root.
 *
 * @param basePath optional override; pass an absolute path if the app is mounted on a sub-path.
 */
export async function dcInitComponents(basePath: string = '/external/gws_plugin'): Promise<void> {
  if (initialized) {
    return;
  }
  initialized = true;

  const env: DcEnvironmentSettings = await loadEnvironment(`${basePath}/assets/environment.json`);
  environment.settings = env;

  const app = await createApplication(dcAppConfig(basePath));

  createCustomElements(DcTextEditorComponent, 'dc-text-editor', app);
  createCustomElements(DcInputSearchComponent, 'dc-input-search', app);
  createCustomElements(DcSelectResourceComponent, 'dc-select-resource', app);
}

/**
 * Load the environment settings from the given URL.
 */
async function loadEnvironment(url: string): Promise<DcEnvironmentSettings> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to load dc-reflex environment from ${url} (status ${response.status})`);
  }
  return response.json();
}

function createCustomElements(componentType: ComponentType<any>, tagName: string, app: ApplicationRef): void {
  const appElement = createCustomElement(componentType, {
    injector: app.injector,
  });

  // Register the custom element
  customElements.define(tagName, appElement);
}
