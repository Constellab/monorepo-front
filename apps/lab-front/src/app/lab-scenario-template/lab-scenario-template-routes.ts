import { Routes } from '@angular/router';

export const LAB_SCENARIO_TEMPLATE_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import(
        // eslint-disable-next-line max-len
        './lab-scenario-templates-search-page/lab-scenario-templates-search-page/lab-scenario-templates-search-page.component'
      ).then((m) => m.LabScenarioTemplatesSearchPageComponent),
  },
  {
    path: ':id',
    loadComponent: () =>
      import(
        // eslint-disable-next-line max-len
        './lab-scenario-template-detail-page/component/lab-scenario-template-detail-page/lab-scenario-template-detail-page.component'
      ).then((m) => m.LabScenarioTemplateDetailPageComponent),
  },
];
