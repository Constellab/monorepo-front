import { Routes } from '@angular/router';

export const DC_DEV_ROUTES: Routes = [
  {
    path: '',
    redirectTo: 'input-search',
    pathMatch: 'full',
  },
  {
    path: 'input-search',
    loadComponent: () =>
      import('../dev-examples/dc-input-search-dev/dc-input-search-dev.component').then(
        (m) => m.DcInputSearchDevComponent
      ),
  },
  {
    path: 'select-resource',
    loadComponent: () =>
      import('../dev-examples/dc-select-resource-dev/dc-select-resource-dev.component').then(
        (m) => m.DcSelectResourceDevComponent
      ),
  },
  {
    path: 'menu',
    loadComponent: () =>
      import('../dev-examples/dc-menu-dev/dc-menu-dev.component').then((m) => m.DcMenuDevComponent),
  },
  {
    path: 'tree',
    loadComponent: () =>
      import('../dev-examples/dc-tree-dev/dc-tree-dev.component').then((m) => m.DcTreeDevComponent),
  },
  {
    path: 'text-editor',
    loadComponent: () =>
      import('../dev-examples/dc-text-editor-dev/dc-text-editor-dev.component').then(
        (m) => m.DcTextEditorDevComponent
      ),
  },
];
