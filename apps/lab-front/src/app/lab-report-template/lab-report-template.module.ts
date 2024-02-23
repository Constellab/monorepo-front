import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {LabReportTemplateRoutingModule} from './lab-report-template-routing.module';
import {LabReportTemplatesPageModule} from './lab-report-templates-page/lab-report-templates-page.module';
import {
  LabReportTemplateDetailPageModule
} from './lab-report-template-detail-page/lab-report-template-detail-page.module';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,

    LabReportTemplatesPageModule,
    LabReportTemplateDetailPageModule,

    LabReportTemplateRoutingModule,
  ]
})
export class LabReportTemplateModule {
}
