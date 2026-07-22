import { CommonModule } from '@angular/common';
import { inject, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSortHeader } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CoCommunityLibModule } from '@monorepo/community-lib';
import { FlCardModule } from '@monorepo/front-core-lib/fl-card';
import { FlCoreComponentModule } from '@monorepo/front-core-lib/fl-core-component';
import { FlCorePipeModule } from '@monorepo/front-core-lib/fl-core-pipe';
import { FlDateModule } from '@monorepo/front-core-lib/fl-date';
import { FlDialogModule } from '@monorepo/front-core-lib/fl-dialog';
import { FlInfiniteScrollModule } from '@monorepo/front-core-lib/fl-infinite-scroll';
import { FlLoaderModule } from '@monorepo/front-core-lib/fl-loader';
import { FlMarkdownModule } from '@monorepo/front-core-lib/fl-markdown';
import { FlSectionModule } from '@monorepo/front-core-lib/fl-section';
import { FlStatusModule } from '@monorepo/front-core-lib/fl-status';
import { FlIconModule } from '@monorepo/front-core-lib/fl-svg-icon';
import { FlTextIconModule } from '@monorepo/front-core-lib/fl-text-icon';
import { FlTranslateModule, FlTranslateService } from '@monorepo/front-core-lib/fl-translate';

import { LmlAdminerDbInfoComponent } from './component/lml-adminer-db-info/lml-adminer-db-info.component';
import { LmlAdminerInfoDialogComponent } from './component/lml-adminer-info-dialog/lml-adminer-info-dialog.component';
import { LmlBrickVersionDetailComponent } from './component/lml-brick-version-detail/lml-brick-version-detail.component';
import { LmlBrickVersionDetailDialogComponent } from './component/lml-brick-version-detail-dialog/lml-brick-version-detail-dialog.component';
import { LmlBricksConfigFormComponent } from './component/lml-bricks-config-form/lml-bricks-config-form.component';
import { LmlCleanLabManagerFormDialogComponent } from './component/lml-clean-lab-manager-form-dialog/lml-clean-lab-manager-form-dialog.component';
import { LmlComposeDetailDialogComponent } from './component/lml-compose-detail-dialog/lml-compose-detail-dialog.component';
import { LmlConfigureBrickComponent } from './component/lml-configure-brick/lml-configure-brick.component';
import { LmlConfigureEnvVarDialogComponent } from './component/lml-configure-env-var-dialog/lml-configure-env-var-dialog.component';
import { LmlCustomEnvConfigComponent } from './component/lml-custom-env-config/lml-custom-env-config.component';
import { LmlDockerContainerDetailsComponent } from './component/lml-docker-container-details/lml-docker-container-details.component';
import { LmlDockerContainerErrorDialogComponent } from './component/lml-docker-container-error-dialog/lml-docker-container-error-dialog.component';
import { LmlDockerContainerLogsDialogComponent } from './component/lml-docker-container-logs-dialog/lml-docker-container-logs-dialog.component';
import { LmlDockerContainersComponent } from './component/lml-docker-containers/lml-docker-containers.component';
import { LmlDockerContainersListComponent } from './component/lml-docker-containers-list/lml-docker-containers-list.component';
import { LmlDockerUpFormComponent } from './component/lml-docker-up-form/lml-docker-up-form.component';
import { LmlManageEnvVarsDialogComponent } from './component/lml-manage-env-vars-dialog/lml-manage-env-vars-dialog.component';
import { LmlManagerComponent } from './component/lml-manager/lml-manager.component';
import { LmlManagerAdvancedComponent } from './component/lml-manager-advanced/lml-manager-advanced.component';
import { LmlManagerConfigComponent } from './component/lml-manager-config/lml-manager-config.component';
import { LmlManagerStatusComponent } from './component/lml-manager-status/lml-manager-status.component';
import { LmlMcpConfigComponent } from './component/lml-mcp-config/lml-mcp-config.component';
import { LmlMigrationPlanComponent } from './component/lml-migration-plan/lml-migration-plan.component';
import { LmlStatusBannersComponent } from './component/lml-status-banners/lml-status-banners.component';
import { LML_LAB_MANAGER_I18N } from './lml-lab-manager.i18n';
import { LmlCommunityBrickImagePipe } from './pipe/lml-community-brick-image.pipe';

@NgModule({
  declarations: [
    LmlDockerUpFormComponent,
    LmlCleanLabManagerFormDialogComponent,
    LmlDockerContainersListComponent,
    LmlDockerContainerLogsDialogComponent,
    LmlDockerContainerDetailsComponent,
    LmlDockerContainersComponent,
    LmlManagerAdvancedComponent,
    LmlManagerStatusComponent,
    LmlManagerComponent,
    LmlManagerConfigComponent,
    LmlMcpConfigComponent,
    LmlCustomEnvConfigComponent,
    LmlManageEnvVarsDialogComponent,
    LmlConfigureEnvVarDialogComponent,
    LmlBricksConfigFormComponent,
    LmlBrickVersionDetailComponent,
    LmlBrickVersionDetailDialogComponent,
    LmlComposeDetailDialogComponent,
    LmlConfigureBrickComponent,
    LmlCommunityBrickImagePipe,
    LmlAdminerInfoDialogComponent,
    LmlAdminerDbInfoComponent,
    LmlDockerContainerErrorDialogComponent,
    LmlMigrationPlanComponent,
    LmlStatusBannersComponent,
  ],
  exports: [
    LmlManagerComponent,
    LmlManagerConfigComponent,
    LmlManagerAdvancedComponent,
    LmlManagerStatusComponent,
    LmlMcpConfigComponent,
    LmlCustomEnvConfigComponent,
    LmlBricksConfigFormComponent,
    LmlBrickVersionDetailDialogComponent,
    LmlMigrationPlanComponent,
    LmlStatusBannersComponent,
  ],
  imports: [
    CommonModule,

    ReactiveFormsModule,
    FormsModule,

    MatCheckboxModule,
    MatButtonModule,
    MatDialogModule,
    MatExpansionModule,
    MatIconModule,
    MatMenuModule,
    MatProgressBarModule,
    MatTooltipModule,
    MatDividerModule,
    MatFormFieldModule,
    MatInputModule,
    MatChipsModule,
    MatSelectModule,
    MatSlideToggleModule,
    MatTableModule,

    FlDialogModule,
    FlTranslateModule,
    FlStatusModule,
    FlSectionModule,
    FlTextIconModule,
    FlLoaderModule,
    FlCardModule,
    FlCorePipeModule,
    FlInfiniteScrollModule,
    CoCommunityLibModule,
    FlIconModule,
    MatSortHeader,
    FlCoreComponentModule,
    FlDateModule,
    FlMarkdownModule,
  ],
})
export class LmlLabManagerLibModule {
  constructor() {
    const translateService = inject(FlTranslateService);

    translateService.addModuleTranslation('LmlLabManagerLibModule', LML_LAB_MANAGER_I18N);
  }
}
