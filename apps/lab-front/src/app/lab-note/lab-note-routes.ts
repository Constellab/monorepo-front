import { Routes } from '@angular/router';

export const LAB_NOTE_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import(
        './module/lab-note-search-page/component/lab-note-search-page/lab-note-search-page.component'
      ).then((m) => m.LabNoteSearchPageComponent),
  },
  {
    path: ':id',
    loadComponent: () =>
      import(
        './module/lab-note-detail-page/component/lab-note-detail-page/lab-note-detail-page.component'
      ).then((m) => m.LabNoteDetailPageComponent),
  },
];
