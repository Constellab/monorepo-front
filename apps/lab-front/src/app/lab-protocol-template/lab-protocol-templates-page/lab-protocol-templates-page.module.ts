import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {
  LabProtocolTemplatesPageComponent
} from './component/lab-protocol-templates-page/lab-protocol-templates-page.component';
import {LabCoreModule} from '../../lab-core/lab-core.module';
import {
  LabProtocolTemplateCoreModule
} from '../../lab-core/entity-module/lab-protocol-template-core/lab-protocol-template-core.module';
import {LabExperimentCoreModule} from '../../lab-core/entity-module/lab-experiment-core/lab-experiment-core.module';


@NgModule({
  declarations: [
    LabProtocolTemplatesPageComponent
  ],
  imports: [
    CommonModule,

    LabCoreModule,
    LabProtocolTemplateCoreModule,
    LabExperimentCoreModule,
  ]
})
export class LabProtocolTemplatesPageModule { }
