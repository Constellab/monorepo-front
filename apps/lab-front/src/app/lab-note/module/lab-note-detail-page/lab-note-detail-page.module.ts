import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LabNoteDetailPageComponent } from './component/lab-note-detail-page/lab-note-detail-page.component';
import { LabCoreModule } from '../../../lab-core/lab-core.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  LabNoteLinkedExperimentsComponent
} from './component/lab-note-linked-experiments/lab-note-linked-experiments.component';
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
  LabNoteInsertTemplateDialogComponent
} from './component/lab-note-insert-template-dialog/lab-note-insert-template-dialog.component';
import {
  LabDocumentTemplateCoreModule
} from '../../../lab-core/entity-module/lab-document-template-core/lab-document-template-core.module';


@NgModule({
  declarations: [
    LabNoteDetailPageComponent,
    LabNoteLinkedExperimentsComponent,
    LabNoteInsertTemplateDialogComponent
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
    LabNoteInsertTemplateDialogComponent
  ]
})
export class LabNoteDetailPageModule {
}
