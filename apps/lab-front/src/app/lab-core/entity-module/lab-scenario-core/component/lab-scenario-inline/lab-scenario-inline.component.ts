import { Component, Input } from '@angular/core';
import { LabScenario } from '../../../../model/entities/lab-scenario.entity';
import { FlUserModule } from '@monorepo/front-core-lib/fl-user';
import { MatIcon } from '@angular/material/icon';
import { FlIconModule } from '@monorepo/front-core-lib/fl-svg-icon';
import { FlColorModule } from '@monorepo/front-core-lib/fl-color';

@Component({
  selector: 'lab-scenario-inline',
  templateUrl: './lab-scenario-inline.component.html',
  styleUrls: ['./lab-scenario-inline.component.scss'],
  imports: [FlUserModule, MatIcon, FlIconModule, FlColorModule],
})
export class LabScenarioInlineComponent {
  @Input({ required: true }) scenario: LabScenario;
}
