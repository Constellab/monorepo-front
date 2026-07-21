import { ChangeDetectionStrategy,Component, Input } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { FlColorModule } from '@monorepo/front-core-lib/fl-color';
import { FlIconModule } from '@monorepo/front-core-lib/fl-svg-icon';
import { FlUserModule } from '@monorepo/front-core-lib/fl-user';
import { LiScenario } from '@monorepo/lab-lib/li-core';

@Component({
  selector: 'li-scenario-inline',
  templateUrl: './li-scenario-inline.component.html',
  styleUrls: ['./li-scenario-inline.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [FlUserModule, MatIcon, FlIconModule, FlColorModule],
})
export class LiScenarioInlineComponent {
  @Input({ required: true }) scenario: LiScenario;
}
