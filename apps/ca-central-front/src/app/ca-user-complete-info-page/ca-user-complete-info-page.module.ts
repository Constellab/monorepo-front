import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {CaCoreModule} from '../ca-core/ca-core.module';
import {
  CaUserCompleteInfoPageComponent
} from './component/ca-user-complete-info-page/ca-user-complete-info-page.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {CaUserCompleteInfoPageRoutingModule} from './ca-user-complete-info-page-routing.module';
import {CaUserSpacesListComponent} from './component/ca-user-spaces-list/ca-user-spaces-list.component';
import {CaSpaceCoreModule} from '../ca-core/entity-module/ca-space-core/ca-space-core.module';

/**
 * Page used when the user logged for the first time
 *
 * It will ask him to provided information (such as space).
 */
@NgModule({
  declarations: [
    CaUserCompleteInfoPageComponent,
    CaUserSpacesListComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,

    CaCoreModule,
    CaSpaceCoreModule,

    CaUserCompleteInfoPageRoutingModule,
  ],
})
export class CaUserCompleteInfoPageModule {
}
