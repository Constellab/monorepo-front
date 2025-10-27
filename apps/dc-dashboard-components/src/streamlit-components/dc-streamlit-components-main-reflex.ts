import { createCustomElement } from '@angular/elements';
import { createApplication } from '@angular/platform-browser';

import { DcTextEditorComponent } from './dc-components/dc-text-editor/dc-text-editor.component';
import { dcStreamlitComponentsConfig } from './dc-streamlit-components-app.config';

/**
 * Component used in production mode to load the dynamic component
 * It is running in the main app (not in the iframe)
 * and it loads the component in the main app
 * when it receives the init message from the iframe
 */
(async () => {
  const app = await createApplication(dcStreamlitComponentsConfig('.'));

  // Create custom element
  const appElement = createCustomElement(DcTextEditorComponent, {
    injector: app.injector,
  });

  // Register the custom element
  customElements.define('dc-text-editor', appElement);
})();
