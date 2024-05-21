import {NgModule} from '@angular/core';
import {CommonModule, NgOptimizedImage} from '@angular/common';
import {CaCoreModule} from '../../ca-core.module';
import {CaLabInstanceCardComponent} from './component/ca-lab-instance-card/ca-lab-instance-card.component';
import {RouterModule} from '@angular/router';
import {CaLabInstanceTableComponent} from './component/ca-lab-instance-table/ca-lab-instance-table.component';
import {
  CaLabInstanceAdminFormDialogComponent
} from './component/ca-lab-instance-admin-form-dialog/ca-lab-instance-admin-form-dialog.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {CaServerCoreModule} from '../ca-server-core/ca-server-core.module';
import {
  CaLabInstanceStatusDialogComponent
} from './component/ca-lab-instance-status-dialog/ca-lab-instance-status-dialog.component';
import {CaLabLoginButtonComponent} from './component/ca-lab-login-button/ca-lab-login-button.component';
import {CaSpaceCoreModule} from '../ca-space-core/ca-space-core.module';
import {CaConfigCoreModule} from '../ca-config-core/ca-config-core.module';
import {CaLabInstanceSearchComponent} from './component/ca-lab-instance-search/ca-lab-instance-search.component';
import {
  CaLabInstanceSearchFormComponent
} from './component/ca-lab-instance-search-form/ca-lab-instance-search-form.component';
import {CaCloudProviderCoreModule} from '../ca-cloud-provider-core/ca-cloud-provider-core.module';
import {CaLabConfigDialogComponent} from './component/ca-lab-config-dialog/ca-lab-config-dialog.component';
import {CaLabConfigComponent} from './component/ca-lab-config/ca-lab-config.component';
import {
  CaLabInstanceFormDialogComponent
} from './component/ca-lab-instance-form-dialog/ca-lab-instance-form-dialog.component';
import {CaLabFreeTrialInfoComponent} from './component/ca-lab-free-trial-info/ca-lab-free-trial-info.component';
import {
  CaLabFreeTrialFormDialogComponent
} from './component/ca-lab-free-trial-form-dialog/ca-lab-free-trial-form-dialog.component';
import {CaProjectCoreModule} from '../ca-project-core/ca-project-core.module';
import {
  CaLabFreeTrialCardInfoComponent
} from './component/ca-lab-free-trial-card-info/ca-lab-free-trial-card-info.component';
import {
  CaLabFreeTrialCreateButtonComponent
} from './component/ca-lab-free-trial-create-button/ca-lab-free-trial-create-button.component';
import {
  CaLabBackupHistoryTableComponent
} from './component/ca-lab-backup-history-table/ca-lab-backup-history-table.component';
import {CaSelectLabComponent} from './component/ca-select-lab/ca-select-lab.component';
import {CaLabInlineComponent} from './component/ca-lab-inline/ca-lab-inline.component';
import {
  CaLabContestFormDialogComponent
} from './component/ca-lab-contest-form-dialog/ca-lab-contest-form-dialog.component';
import {CaObjectStorageCoreModule} from '../ca-object-storage-core/ca-object-storage-core.module';

/**
 * Core module for Lab and LabInstance
 */
@NgModule({
  declarations: [
    CaLabInstanceCardComponent,
    CaLabInstanceTableComponent,
    CaLabInstanceAdminFormDialogComponent,
    CaLabInstanceStatusDialogComponent,
    CaLabLoginButtonComponent,
    CaLabInstanceSearchComponent,
    CaLabInstanceSearchFormComponent,
    CaLabConfigDialogComponent,
    CaLabConfigComponent,
    CaLabInstanceFormDialogComponent,
    CaLabFreeTrialInfoComponent,
    CaLabFreeTrialFormDialogComponent,
    CaLabFreeTrialCardInfoComponent,
    CaLabFreeTrialCreateButtonComponent,
    CaLabBackupHistoryTableComponent,
    CaSelectLabComponent,
    CaLabInlineComponent,
    CaLabContestFormDialogComponent,
  ],
  exports: [
    CaLabInstanceCardComponent,
    CaLabInstanceTableComponent,
    CaLabInstanceAdminFormDialogComponent,
    CaLabLoginButtonComponent,
    CaLabInstanceSearchComponent,
    CaLabInstanceSearchFormComponent,
    CaLabConfigDialogComponent,
    CaLabConfigComponent,
    CaLabInstanceFormDialogComponent,
    CaLabFreeTrialInfoComponent,
    CaLabFreeTrialFormDialogComponent,
    CaLabFreeTrialCardInfoComponent,
    CaLabFreeTrialCreateButtonComponent,
    CaLabBackupHistoryTableComponent,
    CaSelectLabComponent,
    CaLabInlineComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,

    CaServerCoreModule,
    CaSpaceCoreModule,
    CaConfigCoreModule,
    CaCloudProviderCoreModule,

    CaCoreModule,
    CaProjectCoreModule,
    CaObjectStorageCoreModule,
    NgOptimizedImage,
  ],
})
export class CaLabCoreModule {}
