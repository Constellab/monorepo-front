import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {CaProjectActivityPageComponent} from './component/ca-project-activity-page/ca-project-activity-page.component';
import {CaCoreModule} from '../../../ca-core/ca-core.module';
import {CaActivityCoreModule} from '../../../ca-core/entity-module/ca-activity-core/ca-activity-core.module';

@NgModule({
  declarations: [
    CaProjectActivityPageComponent
  ],
  imports: [
    CommonModule,

    CaCoreModule,
    CaActivityCoreModule,
  ],
})
export class CaProjectActivityPageModule {}
