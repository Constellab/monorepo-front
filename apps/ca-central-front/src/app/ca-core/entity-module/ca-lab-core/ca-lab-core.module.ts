import { NgModule } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { CaCoreModule } from '../../ca-core.module';
import { CaLabCardComponent } from './component/ca-lab-card/ca-lab-card.component';
import { RouterModule } from '@angular/router';
import { CaLabTableComponent } from './component/ca-lab-table/ca-lab-table.component';
import {
  CaLabAdminFormDialogComponent,
} from './component/ca-lab-admin-form-dialog/ca-lab-admin-form-dialog.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CaServerCoreModule } from '../ca-server-core/ca-server-core.module';
import { CaLabStatusDialogComponent } from './component/ca-lab-status-dialog/ca-lab-status-dialog.component';
import { CaLabLoginButtonComponent } from './component/ca-lab-login-button/ca-lab-login-button.component';
import { CaSpaceCoreModule } from '../ca-space-core/ca-space-core.module';
import { CaConfigCoreModule } from '../ca-config-core/ca-config-core.module';
import { CaLabSearchComponent } from './component/ca-lab-search/ca-lab-search.component';
import { CaLabSearchFormComponent } from './component/ca-lab-search-form/ca-lab-search-form.component';
import { CaCloudProviderCoreModule } from '../ca-cloud-provider-core/ca-cloud-provider-core.module';
import { CaLabConfigDialogComponent } from './component/ca-lab-config-dialog/ca-lab-config-dialog.component';
import { CaLabConfigComponent } from './component/ca-lab-config/ca-lab-config.component';
import { CaLabFormDialogComponent } from './component/ca-lab-form-dialog/ca-lab-form-dialog.component';
import { CaLabFreeInfoComponent } from './component/ca-lab-free-info/ca-lab-free-info.component';
import {
  CaLabFreeFormDialogComponent,
} from './component/ca-lab-free-form-dialog/ca-lab-free-form-dialog.component';
import { CaFolderCoreModule } from '../ca-folder-core/ca-folder-core.module';
import {
  CaLabFreeCardInfoComponent,
} from './component/ca-lab-free-card-info/ca-lab-free-card-info.component';
import {
  CaLabBackupHistoryTableComponent,
} from './component/ca-lab-backup-history-table/ca-lab-backup-history-table.component';
import { CaSelectLabComponent } from './component/ca-select-lab/ca-select-lab.component';
import { CaLabInlineComponent } from './component/ca-lab-inline/ca-lab-inline.component';
import {
  CaLabFreeAdminFormDialogComponent,
} from './component/ca-lab-free-admin-form-dialog/ca-lab-free-admin-form-dialog.component';
import { CaObjectStorageCoreModule } from '../ca-object-storage-core/ca-object-storage-core.module';
import {
  CaLabBackupHistoryDetailComponent,
} from './component/ca-lab-backup-history-detail/ca-lab-backup-history-detail.component';
import {
  CaLabBackupHistoryDetailPortalComponent,
} from './component/ca-lab-backup-history-detail-portal/ca-lab-backup-history-detail-portal.component';
import {
  CaLabBackupHistoryDetailPortalDirective,
} from './directive/ca-lab-backup-history-detail-portal.directive';
import {
  CaLabDesktopFormDialogComponent,
} from './component/ca-lab-desktop-form-dialog/ca-lab-desktop-form-dialog.component';
import {
  CaLabSelectStorageComponent,
} from './component/ca-lab-select-storage/ca-lab-select-storage.component';
import {
  CaLabCreateSummaryComponent,
} from './component/ca-lab-create-summary/ca-lab-create-summary.component';
import { CaLabSelectServerComponent } from './component/ca-lab-select-server/ca-lab-select-server.component';

/**
 * Core module for Lab and Lab
 */
@NgModule({
  declarations: [
    CaLabCardComponent,
    CaLabTableComponent,
    CaLabAdminFormDialogComponent,
    CaLabStatusDialogComponent,
    CaLabLoginButtonComponent,
    CaLabSearchComponent,
    CaLabSearchFormComponent,
    CaLabConfigDialogComponent,
    CaLabConfigComponent,
    CaLabFormDialogComponent,
    CaLabFreeInfoComponent,
    CaLabFreeAdminFormDialogComponent,
    CaLabFreeCardInfoComponent,
    CaLabBackupHistoryTableComponent,
    CaSelectLabComponent,
    CaLabInlineComponent,
    CaLabFreeFormDialogComponent,
    CaLabFreeAdminFormDialogComponent,
    CaLabBackupHistoryDetailComponent,
    CaLabBackupHistoryDetailPortalDirective,
    CaLabBackupHistoryDetailPortalComponent,
    CaLabDesktopFormDialogComponent,
    CaLabSelectServerComponent,
    CaLabSelectStorageComponent,
    CaLabCreateSummaryComponent,
  ],
  exports: [
    CaLabCardComponent,
    CaLabTableComponent,
    CaLabAdminFormDialogComponent,
    CaLabLoginButtonComponent,
    CaLabSearchComponent,
    CaLabSearchFormComponent,
    CaLabConfigDialogComponent,
    CaLabConfigComponent,
    CaLabFormDialogComponent,
    CaLabFreeInfoComponent,
    CaLabFreeAdminFormDialogComponent,
    CaLabFreeCardInfoComponent,
    CaLabBackupHistoryTableComponent,
    CaSelectLabComponent,
    CaLabInlineComponent,
    CaLabBackupHistoryDetailComponent,
    CaLabBackupHistoryDetailPortalComponent,
    CaLabSelectServerComponent,
    CaLabSelectStorageComponent,
    CaLabCreateSummaryComponent,
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
    CaFolderCoreModule,
    CaObjectStorageCoreModule,
    NgOptimizedImage,
  ],
})
export class CaLabCoreModule {}
