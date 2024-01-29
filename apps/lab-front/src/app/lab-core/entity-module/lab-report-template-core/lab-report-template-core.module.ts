import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {
  LabReportTemplateInlineComponent
} from './component/lab-report-template-inline/lab-report-template-inline.component';
import {
  LabSelectReportTemplateComponent
} from './component/lab-select-report-template/lab-select-report-template.component';
import {
  LabSelectReportTemplateDynamicFieldComponent
} from './component/lab-select-report-template-dynamic-field/lab-select-report-template-dynamic-field.component';
import {LabCoreModule} from '../../lab-core.module';
import {ReactiveFormsModule} from '@angular/forms';
import {
  LabReportTemplateSearchComponent
} from './component/lab-report-template-search/lab-report-template-search.component';
import {
  LabReportTemplateSearchFormComponent
} from './component/lab-report-template-search-form/lab-report-template-search-form.component';
import {
  LabReportTemplateTableComponent
} from './component/lab-report-template-table/lab-report-template-table.component';
import {RouterModule} from '@angular/router';
import {
  LabSelectReportTemplateDialogComponent
} from './component/lab-select-report-template-dialog/lab-select-report-template-dialog.component';
import {
  LabReportTemplateFormDialogComponent
} from './component/lab-report-template-form-dialog/lab-report-template-form-dialog.component';
import {LabProjectCoreModule} from '../lab-project-core/lab-project-core.module';

@NgModule({
  declarations: [
    LabReportTemplateInlineComponent,
    LabSelectReportTemplateComponent,
    LabSelectReportTemplateDynamicFieldComponent,
    LabReportTemplateSearchComponent,
    LabReportTemplateSearchFormComponent,
    LabReportTemplateTableComponent,
    LabSelectReportTemplateDialogComponent,
    LabReportTemplateFormDialogComponent,
  ],
  exports: [
    LabReportTemplateInlineComponent,
    LabSelectReportTemplateComponent,
    LabSelectReportTemplateDynamicFieldComponent,
    LabReportTemplateSearchComponent,
    LabReportTemplateSearchFormComponent,
    LabReportTemplateTableComponent,
    LabSelectReportTemplateDialogComponent,
    LabReportTemplateFormDialogComponent,
  ],
  imports: [CommonModule, ReactiveFormsModule, RouterModule, LabCoreModule, LabProjectCoreModule],
})
export class LabReportTemplateCoreModule {}
