import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {LabReportTemplatesPageComponent} from './lab-report-templates-page/lab-report-templates-page.component';
import {LabCoreModule} from '../../lab-core/lab-core.module';
import {
  LabReportTemplateCoreModule
} from '../../lab-core/entity-module/lab-report-template-core/lab-report-template-core.module';


@NgModule({
  declarations: [
    LabReportTemplatesPageComponent
  ],
  imports: [
    CommonModule,

    LabCoreModule,
    LabReportTemplateCoreModule,
  ]
})
export class LabReportTemplatesPageModule { }
