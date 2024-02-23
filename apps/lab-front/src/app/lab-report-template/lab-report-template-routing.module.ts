import {RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';
import {
  LabReportTemplateDetailPageComponent
} from './lab-report-template-detail-page/component/lab-report-template-detail-page/lab-report-template-detail-page.component';
import {
  LabReportTemplatesPageComponent
} from './lab-report-templates-page/lab-report-templates-page/lab-report-templates-page.component';


const routes: Routes = [
  {path: '', component: LabReportTemplatesPageComponent},
  {path: ':id', component: LabReportTemplateDetailPageComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LabReportTemplateRoutingModule {
}
