import { Route, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CaMainAppComponent } from './component/ca-main-app/ca-main-app.component';
import {
  caConstAdminRoute,
  caConstBaseRoute, caConstChatRoute,
  caConstDashboardRoute,
  caConstLabsRoute,
  caConstMyFoldersRoute,
  caConstFolderRoute,
  caConstStructureRoute,
  caConstUserPageRoute
} from '../ca-core/utils/ca-base-route';
import { CaLoadUserGuard } from './guard/ca-load-user.guard';
import { CaAdminGuard } from '../ca-core/guard/ca-admin-guard.service';

const routes: Route[] = [
  {
    path: '', redirectTo: caConstBaseRoute, pathMatch: 'full'
  },
  {
    path: caConstBaseRoute, component: CaMainAppComponent, canActivate: [CaLoadUserGuard],
    children: [
      {
        path: '', redirectTo: caConstDashboardRoute, pathMatch: 'full'
      },
      //////////////////////// DASHBOARD /////////////////////////
      {
        path: caConstDashboardRoute,
        loadChildren: () => import('../ca-dashboard/ca-dashboard-page.module').then(m => m.CaDashboardPageModule)
      },

      //////////////////////// LAB /////////////////////////
      {
        path: caConstLabsRoute,
        loadChildren: () => import('../ca-lab/ca-lab.module').then(m => m.CaLabModule)
      },

      //////////////////////// MY FOLDER /////////////////////////
      {
        path: caConstMyFoldersRoute,
        loadChildren: () => import('../ca-folder/module/ca-my-folders/ca-my-folder.module').then(m => m.CaMyFolderModule)
      },

      //////////////////////// FOLDER DETAIL /////////////////////////
      {
        path: caConstFolderRoute,
        loadChildren: () => import('../ca-folder/module/ca-hierarchy-object-detail-page/ca-hierarchy-object-detail-page.module')
          .then(m => m.CaHierarchyObjectDetailPageModule)
      },

      //////////////////////// Admin /////////////////////////
      {
        path: caConstAdminRoute,
        loadChildren: () => import('../ca-admin/ca-admin.module').then(m => m.CaAdminModule),
        canActivate: [CaAdminGuard]
      },
      //////////////////////// STRUCTURE /////////////////////////
      {
        path: caConstStructureRoute,
        loadChildren: () => import('../ca-structure/ca-structure.module').then(m => m.CaStructureModule)
      },
      //////////////////////// CHAT /////////////////////////
      {
        path: caConstChatRoute,
        loadChildren: () => import('../ca-chat/ca-chat.module').then(m => m.CaChatModule)
      },

      //////////////////////// USER PAGE /////////////////////////
      {
        path: caConstUserPageRoute,
        loadChildren: () => import('../ca-user-detail-page/ca-user-detail-page.module')
          .then(m => m.CaUserDetailPageModule)
      }
    ]
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [
    RouterModule
  ]
})
export class CaMainRoutingModule {
}

