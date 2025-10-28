import { createCustomElement } from '@angular/elements';
import { createApplication } from '@angular/platform-browser';

import { dcAppConfig } from './dc-app.config';
import { DcTextEditorComponent } from './dc-components/dc-text-editor/dc-text-editor.component';

/**
 * Component used in production mode to enable
 * the components as web components for Reflex
 */
(async () => {
  const app = await createApplication(dcAppConfig('.'));

  // Create custom element
  const appElement = createCustomElement(DcTextEditorComponent, {
    injector: app.injector,
  });

  // Register the custom element
  customElements.define('dc-text-editor', appElement);
})();
