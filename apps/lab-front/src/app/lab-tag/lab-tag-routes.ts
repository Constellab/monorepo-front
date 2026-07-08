import { Routes } from '@angular/router';

export const LAB_TAG_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./module/lab-tag-search-page/lab-tag-search-page.component')
        .then((m) => m.LabTagSearchPageComponent),
  },
  {
    path: ':key',
    loadComponent: () =>
      import('./module/lab-tag-detail-page/lab-tag-detail-page.component')
        .then((m) => m.LabTagDetailPageComponent),
  }
]
