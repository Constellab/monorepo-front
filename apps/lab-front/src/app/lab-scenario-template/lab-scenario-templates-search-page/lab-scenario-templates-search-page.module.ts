import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  LabScenarioTemplatesSearchPageComponent
} from './lab-scenario-templates-search-page/lab-scenario-templates-search-page.component';
import { LabCoreModule } from '../../lab-core/lab-core.module';
import {
  LabScenarioTemplateCoreModule
} from '../../lab-core/entity-module/lab-scenario-template-core/lab-scenario-template-core.module';
import { LabScenarioCoreModule } from '../../lab-core/entity-module/lab-scenario-core/lab-scenario-core.module';


@NgModule({
  declarations: [
    LabScenarioTemplatesSearchPageComponent
  ],
  imports: [
    CommonModule,

    LabCoreModule,
    LabScenarioTemplateCoreModule,
    LabScenarioCoreModule,
  ]
})
export class LabScenarioTemplatesSearchPageModule { }
