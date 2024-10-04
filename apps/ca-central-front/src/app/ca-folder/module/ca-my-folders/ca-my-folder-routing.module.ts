import {Route, RouterModule} from '@angular/router';
import {NgModule} from '@angular/core';
import {CaMyFoldersPageComponent} from './ca-my-folders-page/ca-my-folders-page.component';

const routes: Route[] = [
  {path: '', component: CaMyFoldersPageComponent},
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [
    RouterModule
  ]
})
export class CaMyFolderRoutingModule {
}

