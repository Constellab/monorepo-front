import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {HaMainComponent} from './ha-main/ha-main.component';
import {Ha404Component} from '../ha-public/module/ha404/ha404.component';
import {HaLoginPageComponent} from './ha-login-page/ha-login-page.component';
import {HaHomeComponent} from './ha-home/ha-home.component';
import {HaRouterService} from '../ha-core/ha-service/ha-router.service';
import {HaIconsPageComponent} from '../ha-icon/component/ha-icons-page/ha-icons-page.component';

const routes: Routes = [
  {
    path: 'admin',
    component: HaMainComponent,
    loadChildren: () => import('../ha-admin/ha-admin.module').then(m => m.HaAdminModule)
  },
  {
    path: 'tech-doc',
    redirectTo: HaRouterService.getTechDocRoute()
  },
  {
    path: 'product-doc',
    redirectTo: HaRouterService.getProductDocRoute()
  },
  {
    path: 'bricks',
    component: HaMainComponent,
    loadChildren: () => import('../ha-public/ha-public.module').then(m => m.HaPublicModule)
  },
  {
    path: 'stories',
    component: HaMainComponent,
    loadChildren: () => import('../ha-story/ha-story.module').then(m => m.HaStoryModule)
  },
  {
    path: 'live-tasks',
    component: HaMainComponent,
    loadChildren: () => import('../ha-live-task/ha-live-task.module').then(m => m.HaLiveTaskModule)
  },
  {
    path: 'icons',
    component: HaMainComponent,
    children: [
      {
        path: '',
        component: HaIconsPageComponent
      }
    ]
  },
  {
    path: 'login',
    component: HaLoginPageComponent,
  },
  {
    path: '',
    component: HaMainComponent,
    children: [
      {
        path: '',
        component: HaHomeComponent
      },
      {
        path: '404',
        component: Ha404Component
      },
      {
        path: '**',
        redirectTo: '404'
      }
    ]
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
  ],
  exports: [
    RouterModule
  ]
})
export class HaMainRoutingModule {
}
