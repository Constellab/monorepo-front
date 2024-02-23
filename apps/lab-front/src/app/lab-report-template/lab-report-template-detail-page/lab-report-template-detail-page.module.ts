import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {
  LabReportTemplateDetailPageComponent
} from './component/lab-report-template-detail-page/lab-report-template-detail-page.component';
import {FormsModule} from '@angular/forms';
import {LabCoreModule} from '../../lab-core/lab-core.module';

@NgModule({
  declarations: [
    LabReportTemplateDetailPageComponent
  ],
  imports: [
    CommonModule,
    FormsModule,

    LabCoreModule
  ],
})
export class LabReportTemplateDetailPageModule {
}
