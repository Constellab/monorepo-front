import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import {
  LabDocumentTemplateDetailPageComponent
} from './lab-document-template-detail-page/lab-document-template-detail-page/lab-document-template-detail-page.component';
import {
  LabDocumentTemplatesPageComponent
} from './lab-document-templates-page/lab-document-templates-page/lab-document-templates-page.component';


const routes: Routes = [
  {path: '', component: LabDocumentTemplatesPageComponent},
  {path: ':id', component: LabDocumentTemplateDetailPageComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LabDocumentTemplateRoutingModule {
}
