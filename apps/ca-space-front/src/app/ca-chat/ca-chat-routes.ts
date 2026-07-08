import { Route } from '@angular/router';

export const CA_CHAT_ROUTES: Route[] = [
  {
    path: '',
    loadComponent: () =>
      import('./component/ca-chat-page/ca-chat-page.component').then((m) => m.CaChatPageComponent),
    children: [
      {
        path: 'folder/:id',
        loadComponent: () =>
          import('./component/ca-chat-detail-page/ca-chat-detail-page.component').then(
            (m) => m.CaChatDetailPageComponent
          ),
      },
    ],
  },
];
