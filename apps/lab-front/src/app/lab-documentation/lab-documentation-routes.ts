import { Routes } from '@angular/router';

export const LAB_DOCUMENTATION_ROUTES: Routes = [
  {
    path: 'technical-doc/:typingName',
    loadComponent: () =>
      import('./lab-technical-doc-page/lab-technical-doc-page.component').then(
        (m) => m.LabTechnicalDocPageComponent
      ),
  },
];
