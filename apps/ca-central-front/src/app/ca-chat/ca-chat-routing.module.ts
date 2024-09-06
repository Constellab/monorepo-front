import { Route, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CaChatPageComponent } from './component/ca-chat-page/ca-chat-page.component';
import { CaChatDetailPageComponent } from './component/ca-chat-detail-page/ca-chat-detail-page.component';

const routes: Route[] = [
  {
    path: '', component: CaChatPageComponent, children: [
      { path: 'folder/:id', component: CaChatDetailPageComponent }
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
export class CaChatRoutingModule {

}
