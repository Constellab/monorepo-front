import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  LabProtocolTemplateDetailPageComponent
} from './component/lab-protocol-template-detail-page/lab-protocol-template-detail-page.component';
import {
  LabProtocolTemplateDetailComponent
} from './component/lab-protocol-template-detail/lab-protocol-template-detail.component';
import { LabCoreModule } from '../../lab-core/lab-core.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  LabProtocolTemplateDetailHeaderComponent
} from './component/lab-protocol-template-detail-header/lab-protocol-template-detail-header.component';
import {
  LabProtocolTemplateWorkflowComponent
} from './component/lab-protocol-template-workflow/lab-protocol-template-workflow.component';
import { LabTagCoreModule } from '../../lab-core/entity-module/lab-tag-core/lab-tag-core.module';


@NgModule({
  declarations: [
    LabProtocolTemplateDetailPageComponent,
    LabProtocolTemplateDetailComponent,
    LabProtocolTemplateDetailHeaderComponent,
    LabProtocolTemplateWorkflowComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,

    LabCoreModule,
    LabTagCoreModule
  ]
})
export class LabProtocolTemplateDetailPageModule {
}
