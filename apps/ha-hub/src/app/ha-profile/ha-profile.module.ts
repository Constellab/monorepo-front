import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {HaUtilComponentCoreModule} from '../ha-core/entity-module/ha-util-component-core/ha-util-component-core.module';
import {HaProfileComponent} from './component/ha-profile/ha-profile.component';
import {HaProfileRoutingModule} from './ha-profile-routing.module';
import {HaCoreModule} from '../ha-core/ha-core.module';
import { HaProfileEditDialogComponent } from './component/ha-profile-edit-dialog/ha-profile-edit-dialog.component';
import { HaProfileAttachedLinkComponent } from './component/ha-profile-attached-link/ha-profile-attached-link.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";

@NgModule({
  declarations: [HaProfileComponent, HaProfileEditDialogComponent, HaProfileAttachedLinkComponent],
    imports: [
        CommonModule,
        HaUtilComponentCoreModule,
        HaCoreModule,
        HaProfileRoutingModule,
        FormsModule,
        ReactiveFormsModule
    ],
  providers: [],
  exports: []
})
export class HaProfileModule {
}
