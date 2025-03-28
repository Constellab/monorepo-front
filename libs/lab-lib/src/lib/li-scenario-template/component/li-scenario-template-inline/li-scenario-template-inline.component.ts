import { Component, Input } from '@angular/core';
import { FlUserModule } from '@monorepo/front-core-lib/fl-user';
import { LiScenarioTemplate } from '@monorepo/lab-lib/li-core';

@Component({
  selector: 'li-scenario-template-inline',
  templateUrl: './li-scenario-template-inline.component.html',
  styleUrls: ['./li-scenario-template-inline.component.scss'],
  imports: [FlUserModule],
})
export class LiScenarioTemplateInlineComponent {
  @Input() scenarioTemplate: LiScenarioTemplate;
}
