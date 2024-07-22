import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LabDocumentTemplateRoutingModule } from './lab-document-template-routing.module';
import { LabDocumentTemplatesPageModule } from './lab-document-templates-page/lab-document-templates-page.module';
import {
  LabDocumentTemplateDetailPageModule
} from './lab-document-template-detail-page/lab-document-template-detail-page.module';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,

    LabDocumentTemplatesPageModule,
    LabDocumentTemplateDetailPageModule,

    LabDocumentTemplateRoutingModule,
  ]
})
export class LabDocumentTemplateModule {
}
