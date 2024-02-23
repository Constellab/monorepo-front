import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {LabProtocolTemplateRoutingModule} from './lab-protocol-template-routing.module';
import {
  LabProtocolTemplateDetailPageModule
} from './lab-protocol-template-detail-page/lab-protocol-template-detail-page.module';
import {LabProtocolTemplatesPageModule} from './lab-protocol-templates-page/lab-protocol-templates-page.module';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,

    LabProtocolTemplatesPageModule,
    LabProtocolTemplateDetailPageModule,

    // routing
    LabProtocolTemplateRoutingModule,
  ]
})
export class LabProtocolTemplateModule {
}
