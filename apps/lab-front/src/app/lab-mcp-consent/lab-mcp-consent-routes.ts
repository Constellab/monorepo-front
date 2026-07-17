import { Routes } from '@angular/router';

/**
 * MCP OAuth consent route. Deliberately top-level and NOT behind the authenticated app shell:
 * the page owns its own login bounce (unauthenticated → /login?redirect_uri=/mcp-consent?login_state=…),
 * so wrapping it in an auth guard would discard login_state. See {@link LabMcpConsentPageComponent}.
 */
export const LAB_MCP_CONSENT_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./lab-mcp-consent-page/lab-mcp-consent-page.component').then(
        (m) => m.LabMcpConsentPageComponent
      ),
  },
];
