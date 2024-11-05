import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LabScenariosListPageComponent } from './lab-scenarios-page-list/lab-scenarios-list-page.component';
import { LabCoreModule } from '../../lab-core/lab-core.module';
import { LabScenarioCoreModule } from '../../lab-core/entity-module/lab-scenario-core/lab-scenario-core.module';

/**
 * Module for the list of scenarios
 */
@NgModule({
  declarations: [LabScenariosListPageComponent],
  imports: [CommonModule, LabCoreModule, LabScenarioCoreModule],
})
export class LabScenariosPageModule {}
