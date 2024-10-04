import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  LabProtocolTemplatesPageComponent
} from './component/lab-protocol-templates-page/lab-protocol-templates-page.component';
import { LabCoreModule } from '../../lab-core/lab-core.module';
import {
  LabProtocolTemplateCoreModule
} from '../../lab-core/entity-module/lab-protocol-template-core/lab-protocol-template-core.module';
import { LabScenarioCoreModule } from '../../lab-core/entity-module/lab-scenario-core/lab-scenario-core.module';


@NgModule({
  declarations: [
    LabProtocolTemplatesPageComponent
  ],
  imports: [
    CommonModule,

    LabCoreModule,
    LabProtocolTemplateCoreModule,
    LabScenarioCoreModule,
  ]
})
export class LabProtocolTemplatesPageModule { }
