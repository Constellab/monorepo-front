import 'zone.js';
import 'reflect-metadata';

import { createCustomElement } from '@angular/elements';
import { createApplication } from '@angular/platform-browser';

import { dcAppConfig } from './dc-app.config';
import { DcTextEditorComponent } from './dc-components/dc-text-editor/dc-text-editor.component';

let initialized = false;

/**
 * Initialize and register the Angular custom elements.
 * Call this function to enable the web components.
 * Safe to call multiple times - will only initialize once.
 */
export async function dcInitComponents(basePath: string = '.'): Promise<void> {
  if (initialized) {
    console.log('DcComponents already initialized.');
    return;
  }
  initialized = true;

  const app = await createApplication(dcAppConfig(basePath));

  // Create custom element
  const appElement = createCustomElement(DcTextEditorComponent, {
    injector: app.injector,
  });

  // Register the custom element
  customElements.define('dc-text-editor', appElement);
}
