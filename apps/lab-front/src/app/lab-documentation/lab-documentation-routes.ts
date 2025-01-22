import { Routes } from '@angular/router';

export const labDocumentationRoutes: Routes = [
  {
    path: 'technical-doc/:typingName',
    loadComponent: () =>
      import('./lab-technical-doc-page/lab-technical-doc-page.component').then(
        (m) => m.LabTechnicalDocPageComponent
      ),
  },
];
