import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  LabDocumentTemplateInlineComponent
} from './component/lab-document-template-inline/lab-document-template-inline.component';
import {
  LabSelectDocumentTemplateComponent
} from './component/lab-select-document-template/lab-select-document-template.component';
import {
  LabSelectDocumentTemplateDynamicFieldComponent
} from './component/lab-select-document-template-dynamic-field/lab-select-document-template-dynamic-field.component';
import { LabCoreModule } from '../../lab-core.module';
import { ReactiveFormsModule } from '@angular/forms';
import {
  LabDocumentTemplateSearchComponent
} from './component/lab-document-template-search/lab-document-template-search.component';
import {
  LabDocumentTemplateSearchFormComponent
} from './component/lab-document-template-search-form/lab-document-template-search-form.component';
import {
  LabDocumentTemplateTableComponent
} from './component/lab-document-template-table/lab-document-template-table.component';
import { RouterModule } from '@angular/router';
import {
  LabSelectDocumentTemplateDialogComponent
} from './component/lab-select-document-template-dialog/lab-select-document-template-dialog.component';
import {
  LabDocumentTemplateFormDialogComponent
} from './component/lab-document-template-form-dialog/lab-document-template-form-dialog.component';
import { LabFolderCoreModule } from '../lab-folder-core/lab-folder-core.module';

@NgModule({
  declarations: [
    LabDocumentTemplateInlineComponent,
    LabSelectDocumentTemplateComponent,
    LabSelectDocumentTemplateDynamicFieldComponent,
    LabDocumentTemplateSearchComponent,
    LabDocumentTemplateSearchFormComponent,
    LabDocumentTemplateTableComponent,
    LabSelectDocumentTemplateDialogComponent,
    LabDocumentTemplateFormDialogComponent
  ],
  exports: [
    LabDocumentTemplateInlineComponent,
    LabSelectDocumentTemplateComponent,
    LabSelectDocumentTemplateDynamicFieldComponent,
    LabDocumentTemplateSearchComponent,
    LabDocumentTemplateSearchFormComponent,
    LabDocumentTemplateTableComponent,
    LabSelectDocumentTemplateDialogComponent,
    LabDocumentTemplateFormDialogComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    LabCoreModule,
    LabFolderCoreModule
  ]
})
export class LabDocumentTemplateCoreModule {
}
