import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LabNoteTemplateInlineComponent } from './component/lab-note-template-inline/lab-note-template-inline.component';
import { LabSelectNoteTemplateComponent } from './component/lab-select-note-template/lab-select-note-template.component';
import { LabSelectNoteTemplateDynamicFieldComponent } from './component/lab-select-note-template-dynamic-field/lab-select-note-template-dynamic-field.component';
import { LabCoreModule } from '../../lab-core.module';
import { ReactiveFormsModule } from '@angular/forms';
import { LabNoteTemplateSearchComponent } from './component/lab-note-template-search/lab-note-template-search.component';
import { LabNoteTemplateSearchFormComponent } from './component/lab-note-template-search-form/lab-note-template-search-form.component';
import { LabNoteTemplateTableComponent } from './component/lab-note-template-table/lab-note-template-table.component';
import { RouterModule } from '@angular/router';
import { LabSelectNoteTemplateDialogComponent } from './component/lab-select-note-template-dialog/lab-select-note-template-dialog.component';
import { LabNoteTemplateFormDialogComponent } from './component/lab-note-template-form-dialog/lab-note-template-form-dialog.component';
import { LabFolderCoreModule } from '../lab-folder-core/lab-folder-core.module';

@NgModule({
  declarations: [
    LabNoteTemplateInlineComponent,
    LabSelectNoteTemplateComponent,
    LabSelectNoteTemplateDynamicFieldComponent,
    LabNoteTemplateSearchComponent,
    LabNoteTemplateSearchFormComponent,
    LabNoteTemplateTableComponent,
    LabSelectNoteTemplateDialogComponent,
    LabNoteTemplateFormDialogComponent,
  ],
  exports: [
    LabNoteTemplateInlineComponent,
    LabSelectNoteTemplateComponent,
    LabSelectNoteTemplateDynamicFieldComponent,
    LabNoteTemplateSearchComponent,
    LabNoteTemplateSearchFormComponent,
    LabNoteTemplateTableComponent,
    LabSelectNoteTemplateDialogComponent,
    LabNoteTemplateFormDialogComponent,
  ],
  imports: [CommonModule, ReactiveFormsModule, RouterModule, LabCoreModule, LabFolderCoreModule],
})
export class LabNoteTemplateCoreModule {}
