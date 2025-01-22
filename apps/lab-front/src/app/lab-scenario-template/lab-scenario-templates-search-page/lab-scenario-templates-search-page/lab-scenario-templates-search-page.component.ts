import { Component } from '@angular/core';
import { LabScenarioTemplateSearchComponent } from '../../../lab-core/entity-module/lab-scenario-template-core/component/lab-scenario-template-search/lab-scenario-template-search.component';

@Component({
  selector: 'lab-scenario-templates-page',
  templateUrl: './lab-scenario-templates-search-page.component.html',
  styleUrl: './lab-scenario-templates-search-page.component.scss',
  imports: [LabScenarioTemplateSearchComponent],
})
export class LabScenarioTemplatesSearchPageComponent {}
