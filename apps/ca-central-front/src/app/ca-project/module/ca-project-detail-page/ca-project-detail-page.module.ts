import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {CaProjectDetailPageComponent} from './component/ca-project-detail-page/ca-project-detail-page.component';
import {CaCoreModule} from '../../../ca-core/ca-core.module';
import {CaProjectCoreModule} from '../../../ca-core/entity-module/ca-project-core/ca-project-core.module';
import {CaProjectDetailComponent} from './component/ca-project-detail/ca-project-detail.component';
import {RouterModule} from '@angular/router';
import {CaExperimentCoreModule} from '../ca-experiment-core/ca-experiment-core.module';
import {CaReportCoreModule} from '../ca-report-core/ca-report-core.module';
import {CaGroupCoreModule} from '../../../ca-core/entity-module/ca-group-core/ca-group-core.module';
import {CaProjectSharedListComponent} from './component/ca-project-shared-list/ca-project-shared-list.component';
import {CaProjectChildrenComponent} from './component/ca-project-children/ca-project-children.component';
import {CaProjectObjectCoreModule} from '../ca-project-object-core/ca-project-object-core.module';
import {CaProjectUsersComponent} from './component/ca-project-users/ca-project-users.component';
import {
  CaProjectDetailRightPanelComponent
} from './component/ca-project-detail-right-panel/ca-project-detail-right-panel.component';
import {CaProjectDescriptionComponent} from './component/ca-project-description/ca-project-description.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {
  CaProjectReportPreviewComponent
} from './component/ca-project-report-preview/ca-project-report-preview.component';
import {
  CaProjectExperimentPreviewComponent
} from './component/ca-project-experiment-preview/ca-project-experiment-preview.component';
import {CaLabCoreModule} from '../../../ca-core/entity-module/ca-lab-core/ca-lab-core.module';
import {CaProjectCommentsComponent} from './component/ca-project-comments/ca-project-comments.component';
import {CaCommentModule} from '../../../ca-comment/ca-comment.module';
import {CaProjectSettingsComponent} from './component/ca-project-settings/ca-project-settings.component';
import {
  CaProjectStorageSettingsComponent
} from './component/ca-project-storage-settings/ca-project-storage-settings.component';
import {
  CaProjectConfigureStorageComponent
} from './component/ca-project-configure-storage/ca-project-configure-storage.component';
import {
  CaObjectStorageCoreModule
} from '../../../ca-core/entity-module/ca-object-storage-core/ca-object-storage-core.module';
import {
  CaProjectDocumentsListComponent
} from './component/ca-project-documents-list/ca-project-documents-list.component';
import {CaDocumentCoreModule} from '../ca-document-core/ca-document-core.module';
import {CaUserCoreModule} from '../../../ca-core/entity-module/ca-user-core/ca-user-core.module';
import {
  CaNotificationCoreModule
} from '../../../ca-core/entity-module/ca-notification-core/ca-notification-core.module';
import {
  CaProjectUserConfigDialogComponent
} from './component/ca-project-user-config-dialog/ca-project-user-config-dialog.component';
import {
  CaDocumentTrashListDialogComponent
} from './component/ca-document-trash-list-dialog/ca-document-trash-list-dialog.component';
import {CaTextEditorModule} from '../ca-text-editor/ca-text-editor.module';
import {
  CaProjectStorageUsageSectionComponent
} from './component/ca-project-storage-usage-section/ca-project-storage-usage-section.component';

/**
 * Module for the project detail page
 */
@NgModule({
  declarations: [
    CaProjectDetailPageComponent,
    CaProjectDetailComponent,
    CaProjectSharedListComponent,
    CaProjectChildrenComponent,
    CaProjectUsersComponent,
    CaProjectDetailRightPanelComponent,
    CaProjectDescriptionComponent,
    CaProjectReportPreviewComponent,
    CaProjectExperimentPreviewComponent,
    CaProjectCommentsComponent,
    CaProjectSettingsComponent,
    CaProjectStorageSettingsComponent,
    CaProjectConfigureStorageComponent,
    CaProjectDocumentsListComponent,
    CaProjectUserConfigDialogComponent,
    CaDocumentTrashListDialogComponent,
    CaProjectStorageUsageSectionComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,

    CaCoreModule,
    CaProjectObjectCoreModule,
    CaProjectCoreModule,
    CaExperimentCoreModule,
    CaReportCoreModule,
    CaDocumentCoreModule,
    CaGroupCoreModule,
    CaLabCoreModule,
    CaCommentModule,
    CaObjectStorageCoreModule,
    CaUserCoreModule,
    CaNotificationCoreModule,
    CaTextEditorModule.forRoot({
      blots: []
    })
  ],
})
export class CaProjectDetailPageModule {
}
