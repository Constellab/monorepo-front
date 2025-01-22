import { Component, Input } from '@angular/core';
import { LabScenarioTemplate } from '../../../../model/entities/process/lab-scenario-template.entity';
import { FlUserModule } from '../../../../../../../../../libs/front-core-lib/src/lib/module/fl-user/fl-user.module';

@Component({
  selector: 'lab-scenario-template-inline',
  templateUrl: './lab-scenario-template-inline.component.html',
  styleUrls: ['./lab-scenario-template-inline.component.scss'],
  imports: [FlUserModule],
})
export class LabScenarioTemplateInlineComponent {
  @Input() scenarioTemplate: LabScenarioTemplate;
}
