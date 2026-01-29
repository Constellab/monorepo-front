import 'zone.js';
import 'reflect-metadata';

import { ComponentType } from '@angular/cdk/overlay';
import { ApplicationRef } from '@angular/core';
import { createCustomElement } from '@angular/elements';
import { createApplication } from '@angular/platform-browser';

import { dcAppConfig } from './dc-app.config';
import { DcInputSearchComponent } from './dc-components/dc-input-search/dc-input-search.component';
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

  createCustomElements(DcTextEditorComponent, 'dc-text-editor', app);
  createCustomElements(DcInputSearchComponent, 'dc-input-search', app);
}

function createCustomElements(componentType: ComponentType<any>, tagName: string, app: ApplicationRef): void {
  const appElement = createCustomElement(componentType, {
    injector: app.injector,
  });

  // Register the custom element
  customElements.define(tagName, appElement);
}
