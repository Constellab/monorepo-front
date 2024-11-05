import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CaAuthenticatedUserInlineComponent } from './component/ca-authenticated-user-inline/ca-authenticated-user-inline.component';
import { CaUserTableComponent } from './component/ca-user-table/ca-user-table.component';
import { CaUserListInlineComponent } from './component/ca-user-list-inline/ca-user-list-inline.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CaUserSearchComponent } from './component/ca-user-search/ca-user-search.component';
import { CaUserSearchFormComponent } from './component/ca-user-search-form/ca-user-search-form.component';
import { CaCoreModule } from '../../ca-core.module';
import { CaUserMentionPortalComponent } from './component/ca-user-mention-portal/ca-user-mention-portal.component';
import { CaUserUpdateLicenseFormDialogComponent } from './component/ca-user-update-license-form-dialog/ca-user-update-license-form-dialog.component';

/**
 * Module containing users component
 */
@NgModule({
  declarations: [
    CaAuthenticatedUserInlineComponent,
    CaUserTableComponent,
    CaUserListInlineComponent,
    CaUserSearchComponent,
    CaUserSearchFormComponent,
    CaUserMentionPortalComponent,
    CaUserUpdateLicenseFormDialogComponent,
  ],
  exports: [
    CaAuthenticatedUserInlineComponent,
    CaUserTableComponent,
    CaUserListInlineComponent,
    CaUserSearchComponent,
    CaUserSearchFormComponent,
    CaUserMentionPortalComponent,
  ],
  imports: [CommonModule, FormsModule, ReactiveFormsModule, CaCoreModule, RouterModule],
})
export class CaUserCoreModule {}
