import { Routes } from '@angular/router';

export const labScenarioTemplateRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import(
        './lab-scenario-templates-search-page/lab-scenario-templates-search-page/lab-scenario-templates-search-page.component'
      ).then((m) => m.LabScenarioTemplatesSearchPageComponent),
  },
  {
    path: ':id',
    loadComponent: () =>
      import(
        './lab-scenario-template-detail-page/component/lab-scenario-template-detail-page/lab-scenario-template-detail-page.component'
      ).then((m) => m.LabScenarioTemplateDetailPageComponent),
  },
];
