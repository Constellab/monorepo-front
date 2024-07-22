import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  LabDocumentTemplateDetailPageComponent
} from './lab-document-template-detail-page/lab-document-template-detail-page.component';
import { FormsModule } from '@angular/forms';
import { LabCoreModule } from '../../lab-core/lab-core.module';

@NgModule({
  declarations: [
    LabDocumentTemplateDetailPageComponent
  ],
  imports: [
    CommonModule,
    FormsModule,

    LabCoreModule
  ],
})
export class LabDocumentTemplateDetailPageModule {
}
