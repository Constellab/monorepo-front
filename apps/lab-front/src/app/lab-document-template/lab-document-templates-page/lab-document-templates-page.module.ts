import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LabDocumentTemplatesPageComponent } from './lab-document-templates-page/lab-document-templates-page.component';
import { LabCoreModule } from '../../lab-core/lab-core.module';
import {
  LabDocumentTemplateCoreModule
} from '../../lab-core/entity-module/lab-document-template-core/lab-document-template-core.module';


@NgModule({
  declarations: [
    LabDocumentTemplatesPageComponent
  ],
  imports: [
    CommonModule,

    LabCoreModule,
    LabDocumentTemplateCoreModule,
  ]
})
export class LabDocumentTemplatesPageModule { }
