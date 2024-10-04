import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LabCoreModule } from '../../lab-core.module';
import { LabNoteSearchComponent } from './component/lab-note-search/lab-note-search.component';
import { LabNoteSearchFormComponent } from './component/lab-note-search-form/lab-note-search-form.component';
import { LabNoteTableComponent } from './component/lab-note-table/lab-note-table.component';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LabNoteFormDialogComponent } from './component/lab-note-form-dialog/lab-note-form-dialog.component';
import { LabSelectNoteDialogComponent } from './component/lab-note-note-dialog/lab-select-note-dialog.component';
import { LabEntityCoreModule } from '../lab-entity-core/lab-entity-core.module';
import { LabFolderCoreModule } from '../lab-folder-core/lab-folder-core.module';
import { LabSelectNoteComponent } from './component/lab-select-note/lab-select-note.component';
import { LabNoteInlineComponent } from './component/lab-note-inline/lab-note-inline.component';
import { LabDocumentTemplateCoreModule } from '../lab-document-template-core/lab-document-template-core.module';
import {
  LabSelectNoteDynamicFieldComponent
} from './component/lab-select-note-dynamic-field/lab-select-note-dynamic-field.component';
import { LabTagCoreModule } from '../lab-tag-core/lab-tag-core.module';

@NgModule({
  declarations: [
    LabNoteSearchComponent,
    LabNoteSearchFormComponent,
    LabNoteTableComponent,
    LabNoteFormDialogComponent,
    LabSelectNoteDialogComponent,
    LabSelectNoteComponent,
    LabNoteInlineComponent,
    LabSelectNoteDynamicFieldComponent,
  ],
  exports: [
    LabNoteSearchComponent,
    LabNoteSearchFormComponent,
    LabNoteTableComponent,
    LabNoteFormDialogComponent,
    LabSelectNoteDialogComponent,
    LabSelectNoteComponent,
    LabNoteInlineComponent,
    LabSelectNoteDynamicFieldComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    FormsModule,

    LabCoreModule,
    LabEntityCoreModule,
    LabFolderCoreModule,
    LabDocumentTemplateCoreModule,
    LabTagCoreModule
  ]
})
export class LabNoteCoreModule {}
