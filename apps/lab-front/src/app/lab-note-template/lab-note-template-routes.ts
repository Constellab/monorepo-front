import { Routes } from '@angular/router';

export const labNoteTemplateRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import(
        './lab-note-templates-search-page/lab-note-templates-search-page/lab-note-templates-search-page.component'
      ).then((m) => m.LabNoteTemplatesSearchPageComponent),
  },
  {
    path: ':id',
    loadComponent: () =>
      import(
        './lab-note-template-detail-page/lab-note-template-detail-page/lab-note-template-detail-page.component'
      ).then((m) => m.LabNoteTemplateDetailPageComponent),
  },
];
