import {RouterModule, Routes} from '@angular/router';
import {
  LabProtocolTemplateDetailPageComponent
} from './lab-protocol-template-detail-page/component/lab-protocol-template-detail-page/lab-protocol-template-detail-page.component';
import {NgModule} from '@angular/core';
import {
  LabProtocolTemplatesPageComponent
} from './lab-protocol-templates-page/component/lab-protocol-templates-page/lab-protocol-templates-page.component';

const routes: Routes = [
  {path: '', component: LabProtocolTemplatesPageComponent},
  {path: ':id', component: LabProtocolTemplateDetailPageComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LabProtocolTemplateRoutingModule {
}
