import { Route } from '@angular/router';

export const CA_HIERARCHY_OBJECT_ROUTES: Route[] = [
  {
    path: '',
    loadComponent: () =>
      import('./ca-hierarchy-object-detail-page/ca-hierarchy-object-detail-page.component').then(
        (m) => m.CaHierarchyObjectDetailPageComponent
      ),
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./ca-root-folder-page/ca-root-folders-page.component').then(
            (m) => m.CaRootFoldersPageComponent
          ),
        data: {
          context: 'rootFolders',
        },
      },
      {
        path: 'all/search',
        loadComponent: () =>
          import(
            '../ca-folder-global-search/ca-folder-global-search-page/ca-folder-global-search-page.component'
          ).then((m) => m.CaFolderGlobalSearchPageComponent),
        data: {
          context: 'globalSearch',
        },
      },
      {
        path: ':id',
        loadComponent: () =>
          import(
            '../ca-folder-detail-page/component/ca-folder-detail-page/ca-folder-detail-page.component'
          ).then((m) => m.CaFolderDetailPageComponent),
      },
      {
        path: ':id/activity',
        loadComponent: () =>
          import(
            '../ca-folder-activity-page/component/ca-folder-activity-page/ca-folder-activity-page.component'
          ).then((m) => m.CaFolderActivityPageComponent),
      },
      {
        path: 'scenario/:id',
        loadComponent: () =>
          import('../ca-scenario-detail-page/ca-scenario-detail-page/ca-scenario-detail-page.component').then(
            (m) => m.CaScenarioDetailPageComponent
          ),
      },
      {
        path: 'note/:id',
        loadComponent: () =>
          import('../ca-note-detail-page/component/ca-note-detail-page/ca-note-detail-page.component').then(
            (m) => m.CaNoteDetailPageComponent
          ),
      },
      {
        path: 'document/:id',
        loadComponent: () =>
          import(
            // eslint-disable-next-line max-len
            '../ca-document-detail-page/component/ca-constellab-document-detail-page/ca-constellab-document-detail-page.component'
          ).then((m) => m.CaConstellabDocumentDetailPageComponent),
      },
      {
        path: 'document/:id/preview',
        loadComponent: () =>
          import(
            '../ca-document-detail-page/component/ca-document-preview-page/ca-document-preview-page.component'
          ).then((m) => m.CaDocumentPreviewPageComponent),
      },
      {
        path: 'resource/:id',
        loadComponent: () =>
          import('../ca-resource-detail-page/ca-resource-detail-page/ca-resource-detail-page.component').then(
            (m) => m.CaResourceDetailPageComponent
          ),
      },
    ],
  },
];
