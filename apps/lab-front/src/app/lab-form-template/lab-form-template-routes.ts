import { Routes } from '@angular/router';

export const LAB_FORM_TEMPLATE_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./module/lab-form-template-search-page/component/lab-form-template-search-page.component').then(
        (m) => m.LabFormTemplateSearchPageComponent
      ),
  },
  {
    path: ':templateId',
    loadComponent: () =>
      import('./module/lab-form-template-detail-page/component/lab-form-template-detail-page.component').then(
        (m) => m.LabFormTemplateDetailPageComponent
      ),
  },
  {
    path: ':templateId/versions/:versionId',
    loadComponent: () =>
      import('./module/lab-form-template-detail-page/component/lab-form-template-detail-page.component').then(
        (m) => m.LabFormTemplateDetailPageComponent
      ),
  },
];
