import { Component, Input } from '@angular/core';
import { LabScenarioTemplate } from '../../../../model/entities/process/lab-scenario-template.entity';

@Component({
  selector: 'lab-scenario-template-inline',
  templateUrl: './lab-scenario-template-inline.component.html',
  styleUrls: ['./lab-scenario-template-inline.component.scss'],
})
export class LabScenarioTemplateInlineComponent {
  @Input() scenarioTemplate: LabScenarioTemplate;
}
