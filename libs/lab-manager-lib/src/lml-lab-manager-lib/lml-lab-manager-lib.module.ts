import { CommonModule } from '@angular/common';
import { inject, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select';
import { MatSortHeader } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CoCommunityLibModule } from '@monorepo/community-lib';
import { FlCardModule } from '@monorepo/front-core-lib/fl-card';
import { FlCoreComponentModule } from '@monorepo/front-core-lib/fl-core-component';
import { FlCorePipeModule } from '@monorepo/front-core-lib/fl-core-pipe';
import { FlDialogModule } from '@monorepo/front-core-lib/fl-dialog';
import { FlInfiniteScrollModule } from '@monorepo/front-core-lib/fl-infinite-scroll';
import { FlKeyValueModule } from '@monorepo/front-core-lib/fl-key-value';
import { FlLoaderModule } from '@monorepo/front-core-lib/fl-loader';
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
import { LmlConfigureBrickComponent } from './component/lml-configure-brick/lml-configure-brick.component';
import { LmlDockerContainerDetailsComponent } from './component/lml-docker-container-details/lml-docker-container-details.component';
import { LmlDockerContainerErrorDialogComponent } from './component/lml-docker-container-error-dialog/lml-docker-container-error-dialog.component';
import { LmlDockerContainerLogsDialogComponent } from './component/lml-docker-container-logs-dialog/lml-docker-container-logs-dialog.component';
import { LmlDockerContainersComponent } from './component/lml-docker-containers/lml-docker-containers.component';
import { LmlDockerContainersListComponent } from './component/lml-docker-containers-list/lml-docker-containers-list.component';
import { LmlDockerUpFormComponent } from './component/lml-docker-up-form/lml-docker-up-form.component';
import { LmlManagerComponent } from './component/lml-manager/lml-manager.component';
import { LmlManagerAdvancedComponent } from './component/lml-manager-advanced/lml-manager-advanced.component';
import { LmlManagerConfigComponent } from './component/lml-manager-config/lml-manager-config.component';
import { LmlManagerStatusComponent } from './component/lml-manager-status/lml-manager-status.component';
import { LmlPullBiotaFormDialogComponent } from './component/lml-pull-biota-form-dialog/lml-pull-biota-form-dialog.component';
import { lmlLabManagerI18n } from './lml-lab-manager.i18n';
import { LmlCommunityBrickImagePipe } from './pipe/lml-community-brick-image.pipe';

@NgModule({
  declarations: [
    LmlDockerUpFormComponent,
    LmlPullBiotaFormDialogComponent,
    LmlDockerContainersListComponent,
    LmlDockerContainerLogsDialogComponent,
    LmlDockerContainerDetailsComponent,
    LmlDockerContainersComponent,
    LmlManagerAdvancedComponent,
    LmlManagerStatusComponent,
    LmlManagerComponent,
    LmlManagerConfigComponent,
    LmlBricksConfigFormComponent,
    LmlBrickVersionDetailComponent,
    LmlBrickVersionDetailDialogComponent,
    LmlConfigureBrickComponent,
    LmlCommunityBrickImagePipe,
    LmlAdminerInfoDialogComponent,
    LmlAdminerDbInfoComponent,
    LmlDockerContainerErrorDialogComponent,
  ],
  exports: [LmlManagerComponent, LmlBricksConfigFormComponent, LmlBrickVersionDetailDialogComponent],
  imports: [
    CommonModule,

    ReactiveFormsModule,
    FormsModule,

    MatCheckboxModule,
    MatButtonModule,
    MatExpansionModule,
    MatIconModule,
    MatMenuModule,
    MatTooltipModule,
    MatDividerModule,
    MatFormFieldModule,
    MatInputModule,
    MatChipsModule,
    MatSelectModule,
    MatTableModule,

    FlDialogModule,
    FlTranslateModule,
    FlStatusModule,
    FlSectionModule,
    FlKeyValueModule,
    FlTextIconModule,
    FlLoaderModule,
    FlCardModule,
    FlCorePipeModule,
    FlInfiniteScrollModule,
    CoCommunityLibModule,
    FlIconModule,
    MatSortHeader,
    FlCoreComponentModule,
  ],
})
export class LmlLabManagerLibModule {
  constructor() {
    const translateService = inject(FlTranslateService);

    translateService.addModuleTranslation('LmlLabManagerLibModule', lmlLabManagerI18n);
  }
}
