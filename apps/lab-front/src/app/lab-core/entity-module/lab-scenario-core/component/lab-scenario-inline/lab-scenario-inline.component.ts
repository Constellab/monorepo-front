import { Component, Input } from '@angular/core';
import { LabScenario } from '../../../../model/entities/lab-scenario.entity';

@Component({
  selector: 'lab-scenario-inline',
  templateUrl: './lab-scenario-inline.component.html',
  styleUrls: ['./lab-scenario-inline.component.scss']
})
export class LabScenarioInlineComponent {

  @Input({required: true}) scenario: LabScenario;

}
