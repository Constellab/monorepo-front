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

@NgModule({
  declarations: [
    LabReportTemplateInlineComponent,
    LabSelectReportTemplateComponent,
    LabSelectReportTemplateDynamicFieldComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,

    LabCoreModule,
  ],
  exports: [
    LabReportTemplateInlineComponent,
    LabSelectReportTemplateComponent,
    LabSelectReportTemplateDynamicFieldComponent,
  ],
})
export class LabReportTemplateCoreModule {
}
