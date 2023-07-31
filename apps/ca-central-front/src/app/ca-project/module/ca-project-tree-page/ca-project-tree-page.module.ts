import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {CaProjectTreePageComponent} from './component/ca-project-tree-page/ca-project-tree-page.component';
import {RouterModule} from '@angular/router';
import {CaCoreModule} from '../../../ca-core/ca-core.module';
import {CaProjectCoreModule} from '../../../ca-core/entity-module/ca-project-core/ca-project-core.module';

@NgModule({
  declarations: [
    CaProjectTreePageComponent
  ],
  imports: [
    CommonModule,
    RouterModule,

    CaProjectCoreModule,

    CaCoreModule,

  ],
})
export class CaProjectTreePageModule {
}
