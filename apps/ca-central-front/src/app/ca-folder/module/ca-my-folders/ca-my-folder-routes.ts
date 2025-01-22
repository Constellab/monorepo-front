import { Route } from '@angular/router';

export const caMyFolderRoutes: Route[] = [
  {
    path: '',
    loadComponent: () =>
      import('./ca-my-folders-page/ca-my-folders-page.component').then((m) => m.CaMyFoldersPageComponent),
  },
];
