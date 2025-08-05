import { Routes } from '@angular/router';

export const labBiotaRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./module/lab-biota-databases/component/lab-biota-databases/lab-biota-databases.component').then(
        (m) => m.LabBiotaDatabasesComponent
      ),
  },
  {
    path: 'database/:typingName',
    loadComponent: () =>
      import(
        // eslint-disable-next-line max-len
        './module/lab-biota-database-detail/component/lab-biota-database-detail-page/lab-biota-database-detail-page.component'
      ).then((m) => m.LabBiotaDatabaseDetailPageComponent),
  },
];
