import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LabReportDetailPageComponent } from './component/lab-report-detail-page/lab-report-detail-page.component';
import { LabCoreModule } from '../../../lab-core/lab-core.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  LabReportLinkedExperimentsComponent
} from './component/lab-report-linked-experiments/lab-report-linked-experiments.component';
import { RouterModule } from '@angular/router';
import {
  LabViewConfigCoreModule
} from '../../../lab-core/entity-module/lab-view-config-core/lab-view-config-core.module';
import { LabResourceCoreModule } from '../../../lab-core/entity-module/lab-resource-core/lab-resource-core.module';
import { LabEntityCoreModule } from '../../../lab-core/entity-module/lab-entity-core/lab-entity-core.module';
import {
  LabExperimentCoreModule
} from '../../../lab-core/entity-module/lab-experiment-core/lab-experiment-core.module';
import { LabFolderCoreModule } from '../../../lab-core/entity-module/lab-folder-core/lab-folder-core.module';
import { LabTagCoreModule } from '../../../lab-core/entity-module/lab-tag-core/lab-tag-core.module';
import {
  LabReportInsertTemplateDialogComponent
} from './component/lab-report-insert-template-dialog/lab-report-insert-template-dialog.component';
import {
  LabDocumentTemplateCoreModule
} from '../../../lab-core/entity-module/lab-document-template-core/lab-document-template-core.module';


@NgModule({
  declarations: [
    LabReportDetailPageComponent,
    LabReportLinkedExperimentsComponent,
    LabReportInsertTemplateDialogComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,

    LabCoreModule,
    LabViewConfigCoreModule,
    LabResourceCoreModule,
    LabEntityCoreModule,
    LabExperimentCoreModule,
    LabFolderCoreModule,
    LabTagCoreModule,
    ReactiveFormsModule,
    LabDocumentTemplateCoreModule
  ],
  exports: [
    LabReportInsertTemplateDialogComponent
  ]
})
export class LabReportDetailPageModule {
}
