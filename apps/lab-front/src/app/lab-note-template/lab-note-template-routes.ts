import { Routes } from '@angular/router';

export const LAB_NOTE_TEMPLATE_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import(
        // eslint-disable-next-line max-len
        './lab-note-templates-search-page/lab-note-templates-search-page/lab-note-templates-search-page.component'
      ).then((m) => m.LabNoteTemplatesSearchPageComponent),
  },
  {
    path: ':id',
    loadComponent: () =>
      import(
        // eslint-disable-next-line max-len
        './lab-note-template-detail-page/lab-note-template-detail-page/lab-note-template-detail-page.component'
      ).then((m) => m.LabNoteTemplateDetailPageComponent),
  },
];
