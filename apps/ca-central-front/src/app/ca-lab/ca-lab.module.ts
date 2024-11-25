import { NgModule } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { CaCoreModule } from '../ca-core/ca-core.module';
import { CaLabRoutingModule } from './ca-lab-routing.module';
import { CaLabDetailPageComponent } from './component/lab/ca-lab-detail-page/ca-lab-detail-page.component';
import { CaLabDetailComponent } from './component/lab/ca-lab-detail/ca-lab-detail.component';
import { CaLabCoreModule } from '../ca-core/entity-module/ca-lab-core/ca-lab-core.module';
import { CaServerCoreModule } from '../ca-core/entity-module/ca-server-core/ca-server-core.module';
import { CaMyLabsPageComponent } from './component/lab/ca-my-labs-page/ca-my-labs-page.component';
import { CaLabUsersListComponent } from './component/user/ca-lab-users-list/ca-lab-users-list.component';
import { CaLabUsersTableComponent } from './component/user/ca-lab-users-table/ca-lab-users-table.component';
import {
  CaLabUserFormDialogComponent,
} from './component/user/ca-lab-user-form-dialog/ca-lab-user-form-dialog.component';
import {
  CaLabDesktopUpdateDialogComponent,
} from './component/lab/ca-lab-desktop-update-dialog/ca-lab-desktop-update-dialog.component';
import { CaLabManagerComponent } from './component/manager/ca-lab-manager/ca-lab-manager.component';
import {
  CaLabDockerContainersListComponent,
} from './component/manager/ca-lab-docker-containers-list/ca-lab-docker-containers-list.component';
import {
  CaLabDockerContainerLogsComponent,
} from './component/manager/ca-lab-docker-container-logs/ca-lab-docker-container-logs.component';
import {
  CaLabManagerStatusComponent,
} from './component/manager/ca-lab-manager-status/ca-lab-manager-status.component';
import {
  CaLabDockerUpFormComponent,
} from './component/manager/ca-lab-docker-up-form/ca-lab-docker-up-form.component';
import {
  CaLabManagerConfigComponent,
} from './component/manager/ca-lab-manager-config/ca-lab-manager-config.component';
import { CaLabConfigFormComponent } from './component/lab/ca-lab-config-form/ca-lab-config-form.component';
import { CaLabConfigBrickComponent } from './component/lab/ca-lab-config-brick/ca-lab-config-brick.component';
import {
  CaLabDockerContainersComponent,
} from './component/manager/ca-lab-docker-containers/ca-lab-docker-containers.component';
import {
  CaLabFoldersListComponent,
} from './component/folder/ca-lab-folders-list/ca-lab-folders-list.component';
import {
  CaLabFoldersTableComponent,
} from './component/folder/ca-lab-folders-table/ca-lab-folders-table.component';
import { CaLabCodelabInfoComponent } from './component/lab/ca-lab-codelab-info/ca-lab-codelab-info.component';
import { CaLabHeaderComponent } from './component/lab/ca-lab-header/ca-lab-header.component';
import {
  CaLabDashboardPageComponent,
} from './component/lab/ca-lab-dashboard-page/ca-lab-dashboard-page.component';
import { CaLabConfigPageComponent } from './component/lab/ca-lab-config-page/ca-lab-config-page.component';
import { CaLabServerComponent } from './component/support/ca-lab-server/ca-lab-server.component';
import {
  CaLabServerCompleteInfoComponent,
} from './component/server/ca-lab-server-complete-info/ca-lab-server-complete-info.component';
import {
  CaLabServerCompleteInfoDialogComponent,
} from './component/server/ca-lab-server-complete-info-dialog/ca-lab-server-complete-info-dialog.component';
import { CaLabStartStopComponent } from './component/lab/ca-lab-start-stop/ca-lab-start-stop.component';
import {
  CaLabServerStatusComponent,
} from './component/server/ca-lab-server-status/ca-lab-server-status.component';
import {
  CaLabServerInfoCardComponent,
} from './component/server/ca-lab-server-info-card/ca-lab-server-info-card.component';
import {
  CaLabDesktopConfigComponent,
} from './component/desktop/ca-lab-desktop-config/ca-lab-desktop-config.component';
import {
  CaLabDesktopDownloadConfigComponent,
} from './component/desktop/ca-lab-desktop-download-config/ca-lab-desktop-download-config.component';
import {
  CaLabManagerUpdateDialogComponent,
} from './component/manager/ca-lab-manager-update-dialog/ca-lab-manager-update-dialog.component';
import {
  CaLabPullBiotaFormDialogComponent,
} from './component/manager/ca-lab-pull-biota-form-dialog/ca-lab-pull-biota-form-dialog.component';
import {
  CaLabManagerAdvancedComponent,
} from './component/manager/ca-lab-manager-advanced/ca-lab-manager-advanced.component';
import {
  CaLabGlobalStatusComponent,
} from './component/lab/ca-lab-global-status/ca-lab-global-status.component';
import {
  CaLabGreenOptionsComponent,
} from './component/green-option/ca-lab-green-options/ca-lab-green-options.component';
import {
  CaLabGreenOptionFormDialogComponent,
} from './component/green-option/ca-lab-green-option-form-dialog/ca-lab-green-option-form-dialog.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CaBrickCoreModule } from '../ca-core/entity-module/ca-brick-core/ca-brick-core.module';
import { CaConfigCoreModule } from '../ca-core/entity-module/ca-config-core/ca-config-core.module';
import {
  CaLabGreenOptionTableComponent,
} from './component/green-option/ca-lab-green-option-table/ca-lab-green-option-table.component';
import { CaSpaceCoreModule } from '../ca-core/entity-module/ca-space-core/ca-space-core.module';
import {
  CaLabGreenOptionValueComponent,
} from './component/green-option/ca-lab-green-option-value/ca-lab-green-option-value.component';
import { CaStatusModule } from '../ca-core/module/ca-status/ca-status.module';
import { CaLabUsageComponent } from './component/kpi/ca-lab-usage/ca-lab-usage.component';
import { CaLabUsagePageComponent } from './component/kpi/ca-lab-usage-page/ca-lab-usage-page.component';
import {
  CaLabRunningStatusTableComponent,
} from './component/kpi/ca-lab-running-status-table/ca-lab-running-status-table.component';
import {
  CaLabBackupDetailPageComponent,
} from './component/backup/ca-lab-backup-detail-page/ca-lab-backup-detail-page.component';
import {
  CaLabBackupsStatusesComponent,
} from './component/backup/ca-lab-backups-statuses/ca-lab-backups-statuses.component';
import {
  CaLabBackupHistoryComponent,
} from './component/backup/ca-lab-backup-history/ca-lab-backup-history.component';
import {
  CaCloudProviderCoreModule,
} from '../ca-core/entity-module/ca-cloud-provider-core/ca-cloud-provider-core.module';
import {
  CaLabDockerContainerDetailsComponent,
} from './component/manager/ca-lab-docker-container-details/ca-lab-docker-container-details.component';
import { CaLabCurrentTaskComponent } from './component/lab/ca-lab-current-task/ca-lab-current-task.component';
import {
  CaLabBackupStatusTableComponent,
} from './component/backup/ca-lab-backup-status-table/ca-lab-backup-status-table.component';
import {
  CaLabBackupsStatusesAdminComponent,
} from './component/backup/ca-lab-backups-statuses-admin/ca-lab-backups-statuses-admin.component';
import { CaLabCreatePageComponent } from './component/create/ca-lab-create-page/ca-lab-create-page.component';
import {
  CaLabSelectServerComponent,
} from './component/create/ca-lab-select-server/ca-lab-select-server.component';
import {
  CaLabSupportPageComponent,
} from './component/support/ca-lab-support-page/ca-lab-support-page.component';
import { CaLabSupportComponent } from './component/support/ca-lab-support/ca-lab-support.component';
import {
  CaLabRestoreBackupToLabComponent,
} from './component/backup/ca-lab-restore-backup-to-lab/ca-lab-restore-backup-to-lab.component';
import { CoCommunityLibModule } from '@monorepo/community-lib';
import {
  CaLabStatusHistoryPageComponent,
} from './component/lab/ca-lab-status-history-page/ca-lab-status-history-page.component';
import { CaGroupCoreModule } from '../ca-core/entity-module/ca-group-core/ca-group-core.module';
import {
  CaHierarchyObjectCoreModule,
} from '../ca-core/entity-module/ca-hierarchy-object-core/ca-hierarchy-object-core.module';
import {
  CaLabVolumeHistoryDialogComponent,
} from './component/volume/ca-lab-volume-history-dialog/ca-lab-volume-history-dialog.component';
import {
  CaLabVolumeUpdateDialogComponent,
} from './component/volume/ca-lab-volume-update-dialog/ca-lab-volume-update-dialog.component';
import {
  CaLabVolumeTableComponent,
} from './component/volume/ca-lab-volume-table/ca-lab-volume-table.component';
import {
  CaLabVolumePriceTableComponent,
} from './component/kpi/ca-lab-volume-price-table/ca-lab-volume-price-table.component';
import {
  CaLabBackupStoragePriceTableComponent,
} from './component/kpi/ca-lab-backup-storage-price-table/ca-lab-backup-storage-price-table.component';
import {
  CaLabStoragePriceDialogComponent,
} from './component/kpi/ca-lab-storage-price-dialog/ca-lab-storage-price-dialog.component';
import { CaLabStopDialogComponent } from './component/lab/ca-lab-stop-dialog/ca-lab-stop-dialog.component';

/**
 * Module the lab detail page with iframe for the lab
 */
@NgModule({
  declarations: [
    CaLabDetailPageComponent,
    CaLabDetailComponent,
    CaMyLabsPageComponent,
    CaLabUsersListComponent,
    CaLabUsersTableComponent,
    CaLabUserFormDialogComponent,
    CaLabDesktopUpdateDialogComponent,
    CaLabManagerComponent,
    CaLabDockerContainersListComponent,
    CaLabDockerContainerLogsComponent,
    CaLabManagerStatusComponent,
    CaLabDockerUpFormComponent,
    CaLabManagerConfigComponent,
    CaLabConfigFormComponent,
    CaLabConfigBrickComponent,
    CaLabDockerContainersComponent,
    CaLabFoldersListComponent,
    CaLabFoldersTableComponent,
    CaLabCodelabInfoComponent,
    CaLabHeaderComponent,
    CaLabDashboardPageComponent,
    CaLabConfigPageComponent,
    CaLabStatusHistoryPageComponent,
    CaLabServerComponent,
    CaLabServerCompleteInfoComponent,
    CaLabServerCompleteInfoDialogComponent,
    CaLabStartStopComponent,
    CaLabServerStatusComponent,
    CaLabServerInfoCardComponent,
    CaLabDesktopConfigComponent,
    CaLabDesktopDownloadConfigComponent,
    CaLabManagerUpdateDialogComponent,
    CaLabPullBiotaFormDialogComponent,
    CaLabManagerAdvancedComponent,
    CaLabGlobalStatusComponent,
    CaLabGreenOptionsComponent,
    CaLabGreenOptionFormDialogComponent,
    CaLabGreenOptionTableComponent,
    CaLabGreenOptionValueComponent,
    CaLabUsageComponent,
    CaLabUsagePageComponent,
    CaLabRunningStatusTableComponent,
    CaLabBackupDetailPageComponent,
    CaLabBackupsStatusesComponent,
    CaLabBackupHistoryComponent,
    CaLabDockerContainerDetailsComponent,
    CaLabCurrentTaskComponent,
    CaLabBackupStatusTableComponent,
    CaLabBackupsStatusesAdminComponent,
    CaLabCreatePageComponent,
    CaLabSelectServerComponent,
    CaLabSupportPageComponent,
    CaLabSupportComponent,
    CaLabRestoreBackupToLabComponent,
    CaLabVolumeHistoryDialogComponent,
    CaLabVolumeUpdateDialogComponent,
    CaLabVolumeTableComponent,
    CaLabStoragePriceDialogComponent,
    CaLabVolumePriceTableComponent,
    CaLabBackupStoragePriceTableComponent,
    CaLabStopDialogComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    NgOptimizedImage,

    CaCoreModule,
    CaLabCoreModule,
    CaServerCoreModule,
    CaBrickCoreModule,
    CaConfigCoreModule,
    CaHierarchyObjectCoreModule,

    CaLabRoutingModule,
    CaSpaceCoreModule,
    CaStatusModule,
    CaCloudProviderCoreModule,
    CoCommunityLibModule,
    CaGroupCoreModule,
  ],
})
export class CaLabModule {}
