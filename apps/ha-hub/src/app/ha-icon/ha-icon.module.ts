import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {HaIconInfoPortalComponent} from './component/ha-icon-info-portal/ha-icon-info-portal.component';
import {HaIconListComponent} from './component/ha-icon-list/ha-icon-list.component';
import {HaIconCreateDialogComponent} from './component/ha-icon-create-dialog/ha-icon-create-dialog.component';
import {HaCoreModule} from '../ha-core/ha-core.module';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {FlInputFileModule} from '@monorepo/front-core-lib';

@NgModule({
  declarations: [
    HaIconInfoPortalComponent,
    HaIconListComponent,
    HaIconCreateDialogComponent
  ],
  exports: [
    HaIconInfoPortalComponent,
    HaIconListComponent,
    HaIconCreateDialogComponent
  ],
  imports: [
    CommonModule,
    HaCoreModule,
    FormsModule,
    ReactiveFormsModule,
    FlInputFileModule
  ]
})
export class HaIconModule {

}
