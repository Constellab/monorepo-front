import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {CaCoreModule} from '../ca-core/ca-core.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {CaUserSpacesListComponent} from './component/ca-user-spaces-list/ca-user-spaces-list.component';
import {CaUserDetailPageComponent} from './component/ca-user-detail-page/ca-user-detail-page.component';
import {CaUserDetailPageRoutingModule} from './ca-user-detail-page-routing.module';
import {CaUserSettingsDialogComponent} from './component/ca-user-settings-dialog/ca-user-settings-dialog.component';
import {CaThemeSelectionComponent} from './component/ca-theme-selection/ca-theme-selection.component';
import {CaLanguageSelectionComponent} from './component/ca-language-selection/ca-language-selection.component';
import {
  CaUserProfileEditDialogComponent
} from './component/ca-user-profile-edit-dialog/ca-user-profile-edit-dialog.component';
import {CaUserTwoFaToggleComponent} from './component/ca-user-two-fa-toggle/ca-user-two-fa-toggle.component';
import {CaUserCoreModule} from '../ca-core/entity-module/ca-user-core/ca-user-core.module';
import {CaSpaceCoreModule} from '../ca-core/entity-module/ca-space-core/ca-space-core.module';
import {CaLabCoreModule} from '../ca-core/entity-module/ca-lab-core/ca-lab-core.module';

/**
 * Page used when the user logged for the first time
 *
 * It will ask him to provided information (such as space).
 */
@NgModule({
  declarations: [
    CaUserDetailPageComponent,
    CaUserSpacesListComponent,
    CaUserSettingsDialogComponent,
    CaThemeSelectionComponent,
    CaLanguageSelectionComponent,
    CaUserProfileEditDialogComponent,
    CaUserTwoFaToggleComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,

    CaCoreModule,
    CaSpaceCoreModule,
    // for lab free trial card
    CaLabCoreModule,
    CaUserCoreModule,

    CaUserDetailPageRoutingModule,
  ]
})
export class CaUserDetailPageModule {
}
