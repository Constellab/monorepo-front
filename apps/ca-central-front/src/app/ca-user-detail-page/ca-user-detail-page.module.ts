import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {CaCoreModule} from '../ca-core/ca-core.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {CaUserSpacesListComponent} from './component/ca-user-spaces-list/ca-user-spaces-list.component';
import {CaSpaceCoreModule} from '../ca-core/entity-module/ca-space-core/ca-space-core.module';
import {CaLabCoreModule} from '../ca-core/entity-module/ca-lab-core/ca-lab-core.module';
import {CaUserDetailPageComponent} from './component/ca-user-detail-page/ca-user-detail-page.component';
import {CaUserDetailPageRoutingModule} from './ca-user-detail-page-routing.module';

/**
 * Page used when the user logged for the first time
 *
 * It will ask him to provided information (such as space).
 */
@NgModule({
  declarations: [
    CaUserDetailPageComponent,
    CaUserSpacesListComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,

    CaCoreModule,
    CaSpaceCoreModule,
    CaLabCoreModule,

    CaUserDetailPageRoutingModule,
  ]
})
export class CaUserDetailPageModule {
}
