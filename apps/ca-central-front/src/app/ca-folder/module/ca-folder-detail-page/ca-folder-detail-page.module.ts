import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CaFolderDetailPageComponent } from './component/ca-folder-detail-page/ca-folder-detail-page.component';
import { CaCoreModule } from '../../../ca-core/ca-core.module';
import { CaFolderCoreModule } from '../../../ca-core/entity-module/ca-folder-core/ca-folder-core.module';
import { CaFolderDetailComponent } from './component/ca-folder-detail/ca-folder-detail.component';
import { RouterModule } from '@angular/router';
import { CaExperimentCoreModule } from '../ca-experiment-core/ca-experiment-core.module';
import { CaReportCoreModule } from '../ca-report-core/ca-report-core.module';
import { CaGroupCoreModule } from '../../../ca-core/entity-module/ca-group-core/ca-group-core.module';
import { CaFolderSharedListComponent } from './component/ca-folder-shared-list/ca-folder-shared-list.component';
import {
  CaFolderDetailRightPanelComponent
} from './component/ca-folder-detail-right-panel/ca-folder-detail-right-panel.component';
import { CaFolderDescriptionComponent } from './component/ca-folder-description/ca-folder-description.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  CaFolderReportPreviewComponent
} from './component/ca-folder-report-preview/ca-folder-report-preview.component';
import {
  CaFolderExperimentPreviewComponent
} from './component/ca-folder-experiment-preview/ca-folder-experiment-preview.component';
import { CaLabCoreModule } from '../../../ca-core/entity-module/ca-lab-core/ca-lab-core.module';
import {
  CaFolderChatRightPanelComponent
} from './component/ca-folder-chat-right-panel/ca-folder-chat-right-panel.component';
import { CaFolderSettingsComponent } from './component/ca-folder-settings/ca-folder-settings.component';
import {
  CaFolderStorageSettingsComponent
} from './component/ca-folder-storage-settings/ca-folder-storage-settings.component';
import {
  CaFolderConfigureStorageComponent
} from './component/ca-folder-configure-storage/ca-folder-configure-storage.component';
import {
  CaObjectStorageCoreModule
} from '../../../ca-core/entity-module/ca-object-storage-core/ca-object-storage-core.module';
import { CaDocumentCoreModule } from '../ca-document-core/ca-document-core.module';
import { CaUserCoreModule } from '../../../ca-core/entity-module/ca-user-core/ca-user-core.module';
import {
  CaNotificationCoreModule
} from '../../../ca-core/entity-module/ca-notification-core/ca-notification-core.module';
import {
  CaFolderUserConfigDialogComponent
} from './component/ca-folder-user-config-dialog/ca-folder-user-config-dialog.component';
import {
  CaDocumentTrashListDialogComponent
} from './component/ca-document-trash-list-dialog/ca-document-trash-list-dialog.component';
import {
  CaFolderStorageUsageSectionComponent
} from './component/ca-folder-storage-usage-section/ca-folder-storage-usage-section.component';
import {
  CaHierarchyObjectCoreModule
} from '../../../ca-core/entity-module/ca-hierarchy-object-core/ca-hierarchy-object-core.module';
import {
  CaConstellabDocumentPreviewComponent
} from './component/ca-constellab-document-preview/ca-constellab-document-preview.component';
import { CaFolderDetailInfoComponent } from './component/ca-folder-detail-info/ca-folder-detail-info.component';
import { CaChatCoreModule } from '../../../ca-core/entity-module/ca-chat-core/ca-chat-core.module';
import { CaFolderHierarchyCoreModule } from '../ca-folder-hierarchy-core/ca-folder-hierarchy-core.module';
import {
  CaHierarchyObjectSearchFormComponent
} from './component/ca-hierarchy-object-search-form/ca-hierarchy-object-search-form.component';

/**
 * Module for the folder detail page
 */
@NgModule({
  declarations: [
    CaFolderDetailPageComponent,
    CaFolderDetailComponent,
    CaFolderSharedListComponent,
    CaFolderDetailRightPanelComponent,
    CaFolderDescriptionComponent,
    CaFolderReportPreviewComponent,
    CaFolderExperimentPreviewComponent,
    CaFolderChatRightPanelComponent,
    CaFolderSettingsComponent,
    CaFolderStorageSettingsComponent,
    CaFolderConfigureStorageComponent,
    CaFolderUserConfigDialogComponent,
    CaDocumentTrashListDialogComponent,
    CaFolderStorageUsageSectionComponent,
    CaConstellabDocumentPreviewComponent,
    CaFolderDetailInfoComponent,
    CaHierarchyObjectSearchFormComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,

    CaCoreModule,
    CaHierarchyObjectCoreModule,
    CaFolderHierarchyCoreModule,
    CaFolderCoreModule,
    CaExperimentCoreModule,
    CaReportCoreModule,
    CaDocumentCoreModule,
    CaGroupCoreModule,
    CaLabCoreModule,
    CaObjectStorageCoreModule,
    CaUserCoreModule,
    CaNotificationCoreModule,
    CaChatCoreModule
  ]
})
export class CaFolderDetailPageModule {
}

