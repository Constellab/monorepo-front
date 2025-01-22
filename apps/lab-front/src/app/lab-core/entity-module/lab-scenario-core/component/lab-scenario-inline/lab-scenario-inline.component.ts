import { Component, Input } from '@angular/core';
import { LabScenario } from '../../../../model/entities/lab-scenario.entity';
import { FlUserModule } from '../../../../../../../../../libs/front-core-lib/src/lib/module/fl-user/fl-user.module';
import { MatIcon } from '@angular/material/icon';
import { FlIconModule } from '../../../../../../../../../libs/front-core-lib/src/lib/module/fl-svg-icon/fl-icon.module';
import { FlColorModule } from '../../../../../../../../../libs/front-core-lib/src/lib/module/fl-color/fl-color.module';

@Component({
  selector: 'lab-scenario-inline',
  templateUrl: './lab-scenario-inline.component.html',
  styleUrls: ['./lab-scenario-inline.component.scss'],
  imports: [FlUserModule, MatIcon, FlIconModule, FlColorModule],
})
export class LabScenarioInlineComponent {
  @Input({ required: true }) scenario: LabScenario;
}
