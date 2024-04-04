import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {HaPublicCoreModule} from './module/ha-public-core/ha-public-core.module';
import {HaPublicRoutingModule} from './ha-public-routing.module';
import {HaCoreModule} from '../ha-core/ha-core.module';
import {HaPublicBrickPageModule} from './module/ha-public-brick-page/ha-public-brick-page.module';
import {HaPublicListBricksPageModule} from './module/ha-public-bricks/ha-public-list-bricks-page.module';
import {HaUtilComponentCoreModule} from '../ha-core/entity-module/ha-util-component-core/ha-util-component-core.module';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    HaPublicCoreModule,
    HaUtilComponentCoreModule,
    HaPublicRoutingModule,
    HaPublicBrickPageModule,
    HaPublicListBricksPageModule,
    HaCoreModule
  ]
})
export class HaPublicModule {
}
