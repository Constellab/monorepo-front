import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {CaCoreModule} from '../ca-core/ca-core.module';
import {CaLabInstanceRoutingModule} from './ca-lab-instance-routing.module';
import {
  CaLabInstanceDetailPageComponent
} from './component/ca-lab-instance-detail-page/ca-lab-instance-detail-page.component';
import {CaLabInstanceDetailComponent} from './component/ca-lab-instance-detail/ca-lab-instance-detail.component';
import {CaLabCoreModule} from '../ca-core/entity-module/ca-lab-core/ca-lab-core.module';
import {CaServerInfoCoreModule} from '../ca-core/entity-module/ca-server-info-core/ca-server-info-core.module';
import {CaMyLabInstancesPageComponent} from './component/ca-my-lab-instances-page/ca-my-lab-instances-page.component';
import {
  CaLabInstanceUsersListComponent
} from './component/user/ca-lab-instance-users-list/ca-lab-instance-users-list.component';
import {
  CaLabInstanceUsersTableComponent
} from './component/user/ca-lab-instance-users-table/ca-lab-instance-users-table.component';
import {
  CaLabInstanceUserFormDialogComponent
} from './component/user/ca-lab-instance-user-form-dialog/ca-lab-instance-user-form-dialog.component';
import {
  CaLabInstanceUpdateDialogComponent
} from './component/ca-lab-instance-update-dialog/ca-lab-instance-update-dialog.component';
import {
  CaLabInstanceManagerComponent
} from './component/manager/ca-lab-instance-manager/ca-lab-instance-manager.component';
import {
  CaLabDockerContainersListComponent
} from './component/manager/ca-lab-docker-containers-list/ca-lab-docker-containers-list.component';
import {
  CaLabDockerContainerLogsComponent
} from './component/manager/ca-lab-docker-container-logs/ca-lab-docker-container-logs.component';
import {
  CaLabInstanceManagerStatusComponent
} from './component/manager/ca-lab-instance-manager-status/ca-lab-instance-manager-status.component';
import {
  CaLabInstanceDockerUpFormComponent
} from './component/manager/ca-lab-instance-docker-up-form/ca-lab-instance-docker-up-form.component';
import {
  CaLabInstanceManagerConfigComponent
} from './component/manager/ca-lab-instance-manager-config/ca-lab-instance-manager-config.component';
import {
  CaLabInstanceConfigFormComponent
} from './component/ca-lab-instance-config-form/ca-lab-instance-config-form.component';
import {
  CaLabInstanceConfigBrickComponent
} from './component/ca-lab-instance-config-brick/ca-lab-instance-config-brick.component';
import {
  CaLabDockerContainersComponent
} from './component/manager/ca-lab-docker-containers/ca-lab-docker-containers.component';
import {
  CaLabInstanceProjectsListComponent
} from './component/project/ca-lab-instance-projects-list/ca-lab-instance-projects-list.component';
import {
  CaLabInstanceProjectsTableComponent
} from './component/project/ca-lab-instance-projects-table/ca-lab-instance-projects-table.component';
import {
  CaLabInstanceAddProjectDialogComponent
} from './component/project/ca-lab-instance-add-project-dialog/ca-lab-instance-add-project-dialog.component';
import {
  CaLabInstanceCodelabInfoComponent
} from './component/ca-lab-instance-codelab-info/ca-lab-instance-codelab-info.component';
import {CaLabInstanceHeaderComponent} from './component/ca-lab-instance-header/ca-lab-instance-header.component';
import {
  CaLabInstanceDashboardPageComponent
} from './component/ca-lab-instance-dashboard-page/ca-lab-instance-dashboard-page.component';
import {
  CaLabInstanceConfigPageComponent
} from './component/ca-lab-instance-config-page/ca-lab-instance-config-page.component';
import {CaLabInstanceServerComponent} from './component/server/ca-lab-instance-server/ca-lab-instance-server.component';
import {
  CaLabServerCompleteInfoComponent
} from './component/server/ca-lab-server-complete-info/ca-lab-server-complete-info.component';
import {
  CaLabServerCompleteInfoDialogComponent
} from './component/server/ca-lab-server-complete-info-dialog/ca-lab-server-complete-info-dialog.component';
import {
  CaLabInstanceStartStopComponent
} from './component/ca-lab-instance-start-stop/ca-lab-instance-start-stop.component';
import {
  CaLabInstanceServerStatusComponent
} from './component/server/ca-lab-instance-server-status/ca-lab-instance-server-status.component';
import {
  CaLabServerInfoCardComponent
} from './component/server/ca-lab-server-info-card/ca-lab-server-info-card.component';
import {CaLabDesktopConfigComponent} from './component/desktop/ca-lab-desktop-config/ca-lab-desktop-config.component';
import {
  CaLabDesktopDownloadConfigComponent
} from './component/desktop/ca-lab-desktop-download-config/ca-lab-desktop-download-config.component';
import {
  CaLabManagerUpdateDialogComponent
} from './component/manager/ca-lab-manager-update-dialog/ca-lab-manager-update-dialog.component';
import {
  CaLabPullBiotaFormDialogComponent
} from './component/manager/ca-lab-pull-biota-form-dialog/ca-lab-pull-biota-form-dialog.component';
import {
  CaLabInstanceManagerAdvancedComponent
} from './component/manager/ca-lab-instance-manager-advanced/ca-lab-instance-manager-advanced.component';
import {
  CaLabInstanceGlobalStatusComponent
} from './component/ca-lab-instance-global-status/ca-lab-instance-global-status.component';
import {CaLabGreenOptionsComponent} from './component/green-option/ca-lab-green-options/ca-lab-green-options.component';
import {
  CaLabGreenOptionFormDialogComponent
} from './component/green-option/ca-lab-green-option-form-dialog/ca-lab-green-option-form-dialog.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {CaBrickCoreModule} from '../ca-core/entity-module/ca-brick-core/ca-brick-core.module';
import {CaProjectCoreModule} from '../ca-core/entity-module/ca-project-core/ca-project-core.module';
import {CaConfigCoreModule} from '../ca-core/entity-module/ca-config-core/ca-config-core.module';
import {
  CaLabGreenOptionTableComponent
} from './component/green-option/ca-lab-green-option-table/ca-lab-green-option-table.component';
import {CaSpaceCoreModule} from '../ca-core/entity-module/ca-space-core/ca-space-core.module';
import {
  CaLabGreenOptionValueComponent
} from './component/green-option/ca-lab-green-option-value/ca-lab-green-option-value.component';
import {CaStatusModule} from '../ca-core/module/ca-status/ca-status.module';
import {CaLabInstanceUsageComponent} from './component/kpi/ca-lab-instance-usage/ca-lab-instance-usage.component';
import {
  CaLabInstanceUsagePageComponent
} from './component/kpi/ca-lab-instance-usage-page/ca-lab-instance-usage-page.component';
import {
  CaLabInstanceRunningStatusTableComponent
} from './component/kpi/ca-lab-instance-running-status-table/ca-lab-instance-running-status-table.component';
import {
  CaLabBackupDetailPageComponent
} from './component/backup/ca-lab-backup-detail-page/ca-lab-backup-detail-page.component';
import {CaLabBackupOptionsComponent} from './component/backup/ca-lab-backup-options/ca-lab-backup-options.component';
import {CaLabBackupHistoryComponent} from './component/backup/ca-lab-backup-history/ca-lab-backup-history.component';
import {CaCloudProviderCoreModule} from '../ca-core/entity-module/ca-cloud-provider-core/ca-cloud-provider-core.module';

/**
 * Module the lab instance detail page with iframe for the lab
 */
@NgModule({
  declarations: [
    CaLabInstanceDetailPageComponent,
    CaLabInstanceDetailComponent,
    CaMyLabInstancesPageComponent,
    CaLabInstanceUsersListComponent,
    CaLabInstanceUsersTableComponent,
    CaLabInstanceUserFormDialogComponent,
    CaLabInstanceUpdateDialogComponent,
    CaLabInstanceManagerComponent,
    CaLabDockerContainersListComponent,
    CaLabDockerContainerLogsComponent,
    CaLabInstanceManagerStatusComponent,
    CaLabInstanceDockerUpFormComponent,
    CaLabInstanceManagerConfigComponent,
    CaLabInstanceConfigFormComponent,
    CaLabInstanceConfigBrickComponent,
    CaLabDockerContainersComponent,
    CaLabInstanceProjectsListComponent,
    CaLabInstanceProjectsTableComponent,
    CaLabInstanceAddProjectDialogComponent,
    CaLabInstanceCodelabInfoComponent,
    CaLabInstanceHeaderComponent,
    CaLabInstanceDashboardPageComponent,
    CaLabInstanceConfigPageComponent,
    CaLabInstanceServerComponent,
    CaLabServerCompleteInfoComponent,
    CaLabServerCompleteInfoDialogComponent,
    CaLabInstanceStartStopComponent,
    CaLabInstanceServerStatusComponent,
    CaLabServerInfoCardComponent,
    CaLabDesktopConfigComponent,
    CaLabDesktopDownloadConfigComponent,
    CaLabManagerUpdateDialogComponent,
    CaLabPullBiotaFormDialogComponent,
    CaLabInstanceManagerAdvancedComponent,
    CaLabInstanceGlobalStatusComponent,
    CaLabGreenOptionsComponent,
    CaLabGreenOptionFormDialogComponent,
    CaLabGreenOptionTableComponent,
    CaLabGreenOptionValueComponent,
    CaLabInstanceUsageComponent,
    CaLabInstanceUsagePageComponent,
    CaLabInstanceRunningStatusTableComponent,
    CaLabBackupDetailPageComponent,
    CaLabBackupOptionsComponent,
    CaLabBackupHistoryComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,

    CaCoreModule,
    CaLabCoreModule,
    CaServerInfoCoreModule,
    CaBrickCoreModule,
    CaProjectCoreModule,
    CaConfigCoreModule,

    CaLabInstanceRoutingModule,
    CaSpaceCoreModule,
    CaStatusModule,
    CaCloudProviderCoreModule,
  ],
})
export class CaLabInstanceModule {
}
