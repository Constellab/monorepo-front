import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LmlDockerUpFormComponent } from './component/lml-docker-up-form/lml-docker-up-form.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  FlCardModule,
  FlCorePipeModule,
  FlDialogModule,
  FlIconModule,
  FlInfiniteScrollModule,
  FlKeyValueModule,
  FlLoaderModule,
  FlSectionModule,
  FlStatusModule,
  FlTextIconModule,
  FlTranslateModule,
  FlTranslateService,
} from '@monorepo/front-core-lib';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { LmlPullBiotaFormDialogComponent } from './component/lml-pull-biota-form-dialog/lml-pull-biota-form-dialog.component';
import { LmlDockerContainersListComponent } from './component/lml-docker-containers-list/lml-docker-containers-list.component';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { LmlDockerContainerLogsDialogComponent } from './component/lml-docker-container-logs-dialog/lml-docker-container-logs-dialog.component';
import { LmlDockerContainerDetailsComponent } from './component/lml-docker-container-details/lml-docker-container-details.component';
import { LmlDockerContainersComponent } from './component/lml-docker-containers/lml-docker-containers.component';
import { LmlManagerAdvancedComponent } from './component/lml-manager-advanced/lml-manager-advanced.component';
import { MatDividerModule } from '@angular/material/divider';
import { lmlLabManagerI18n } from './lml-lab-manager.i18n';
import { LmlManagerStatusComponent } from './component/lml-manager-status/lml-manager-status.component';
import { LmlManagerComponent } from './component/lml-manager/lml-manager.component';
import { LmlManagerConfigComponent } from './component/lml-manager-config/lml-manager-config.component';
import { LmlBricksConfigFormComponent } from './component/lml-bricks-config-form/lml-bricks-config-form.component';
import { LmlBrickVersionDetailComponent } from './component/lml-brick-version-detail/lml-brick-version-detail.component';
import { LmlBrickVersionDetailDialogComponent } from './component/lml-brick-version-detail-dialog/lml-brick-version-detail-dialog.component';
import { CoCommunityLibModule } from '@monorepo/community-lib';
import { LmlConfigureBrickComponent } from './component/lml-configure-brick/lml-configure-brick.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatChipsModule } from '@angular/material/chips';
import { MatSelectModule } from '@angular/material/select';
import { LmlCommunityBrickImagePipe } from './pipe/lml-community-brick-image.pipe';
import { LmlAdminerInfoDialogComponent } from './component/lml-adminer-info-dialog/lml-adminer-info-dialog.component';
import { LmlAdminerDbInfoComponent } from './component/lml-adminer-db-info/lml-adminer-db-info.component';
import { MatTableModule } from '@angular/material/table';
import { MatSortHeader } from '@angular/material/sort';
import { LmlDockerContainerErrorDialogComponent } from './component/lml-docker-container-error-dialog/lml-docker-container-error-dialog.component';

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
  ],
})
export class LmlLabManagerLibModule {
  constructor(translateService: FlTranslateService) {
    translateService.addModuleTranslation('LmlLabManagerLibModule', lmlLabManagerI18n);
  }
}
