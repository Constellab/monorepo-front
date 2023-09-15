import {RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';
import {
  LabReportDetailPageComponent
} from './module/lab-report-detail-page/component/lab-report-detail-page/lab-report-detail-page.component';
import {
  LabReportSearchPageComponent
} from './module/lab-report-search-page/component/lab-report-search-page/lab-report-search-page.component';
import {
  LabReportTemplateDetailPageComponent
} from './module/lab-report-template-detail-page/component/lab-report-template-detail-page/lab-report-template-detail-page.component';


const routes: Routes = [
  {path: '', component: LabReportSearchPageComponent},
  {path: ':id', component: LabReportDetailPageComponent},
  {path: 'template/:id', component: LabReportTemplateDetailPageComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LabReportRoutingModule {
}
