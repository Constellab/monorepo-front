import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {HaPublicListBricksPageComponent} from './ha-public-list-bricks-page/ha-public-list-bricks-page.component';
import {HaPublicEditBrickPageComponent} from './ha-public-edit-brick-page/ha-public-edit-brick-page.component';
import {HaPublicEditBrickFormComponent} from './ha-public-edit-brick-form/ha-public-edit-brick-form.component';
import {TranslateModule} from '@ngx-translate/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HaCoreModule} from '../../../ha-core/ha-core.module';
import {MatRadioModule} from '@angular/material/radio';
import {FlInputFileModule, FlKeyValueModule} from '@monorepo/front-core-lib';
import {
  HaUtilComponentCoreModule
} from "../../../ha-core/entity-module/ha-util-component-core/ha-util-component-core.module";
import {HaSpaceModule} from "../../../ha-space/ha-space.module";


@NgModule({
  declarations: [HaPublicListBricksPageComponent, HaPublicEditBrickPageComponent, HaPublicEditBrickFormComponent],
  imports: [
    CommonModule,
    TranslateModule,
    ReactiveFormsModule,
    HaCoreModule,
    MatRadioModule,
    FlKeyValueModule,
    FlInputFileModule,
    HaUtilComponentCoreModule,
    FormsModule,
    HaSpaceModule
  ]
})
export class HaPublicListBricksPageModule {

}
