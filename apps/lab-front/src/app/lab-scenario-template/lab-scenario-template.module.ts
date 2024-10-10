import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LabScenarioTemplateRoutingModule } from './lab-scenario-template-routing.module';
import {
  LabScenarioTemplateDetailPageModule
} from './lab-scenario-template-detail-page/lab-scenario-template-detail-page.module';
import {
  LabScenarioTemplatesSearchPageModule
} from './lab-scenario-templates-search-page/lab-scenario-templates-search-page.module';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,

    LabScenarioTemplatesSearchPageModule,
    LabScenarioTemplateDetailPageModule,

    // routing
    LabScenarioTemplateRoutingModule,
  ]
})
export class LabScenarioTemplateModule {
}
