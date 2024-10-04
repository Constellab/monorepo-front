import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LabScenarioDetailPageModule } from './lab-scenario-detail-page/lab-scenario-detail-page.module';
import { LabScenariosPageModule } from './lab-scenarios-page/lab-scenarios-page.module';
import { LabScenarioRoutingModule } from './lab-scenario-routing.module';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,

    // Biox modules
    LabScenariosPageModule,
    LabScenarioDetailPageModule,

    // routing
    LabScenarioRoutingModule,
  ]
})
export class LabScenarioModule {
}
