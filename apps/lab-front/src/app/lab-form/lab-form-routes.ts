import { Routes } from '@angular/router';

export const LAB_FORM_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./module/lab-form-search-page/component/lab-form-search-page.component').then(
        (m) => m.LabFormSearchPageComponent
      ),
  },
  {
    path: ':id',
    loadComponent: () =>
      import('./module/lab-form-detail-page/component/lab-form-detail-page.component').then(
        (m) => m.LabFormDetailPageComponent
      ),
  },
];
