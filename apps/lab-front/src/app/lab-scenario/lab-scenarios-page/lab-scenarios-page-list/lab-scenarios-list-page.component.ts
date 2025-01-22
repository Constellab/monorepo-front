import { Component } from '@angular/core';
import { LabScenarioSearchComponent } from '../../../lab-core/entity-module/lab-scenario-core/component/lab-scenario-search/lab-scenario-search.component';

@Component({
  selector: 'lab-scenarios-page-list',
  templateUrl: './lab-scenarios-list-page.component.html',
  styleUrls: ['./lab-scenarios-list-page.component.scss'],
  imports: [LabScenarioSearchComponent],
})
export class LabScenariosListPageComponent {}
