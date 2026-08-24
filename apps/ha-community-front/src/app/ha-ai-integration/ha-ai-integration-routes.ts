import { Routes } from '@angular/router';

export const HA_AI_INTEGRATION_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./component/ha-ai-integration-page/ha-ai-integration-page.component').then(
        (m) => m.HaAiIntegrationPageComponent
      ),
  },
];
