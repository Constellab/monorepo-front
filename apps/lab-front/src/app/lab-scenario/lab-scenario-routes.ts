import { Routes } from '@angular/router';

export const labScenarioRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./lab-scenarios-page/lab-scenarios-page-list/lab-scenarios-list-page.component').then(
        (m) => m.LabScenariosListPageComponent
      ),
  },
  {
    path: ':id',
    loadComponent: () =>
      import(
        './lab-scenario-detail-page/component/lab-scenario-detail-page/lab-scenario-detail-page.component'
      ).then((m) => m.LabScenarioDetailPageComponent),
  },
];
