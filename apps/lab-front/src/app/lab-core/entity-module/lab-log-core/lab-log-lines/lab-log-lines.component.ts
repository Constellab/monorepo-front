import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { LabLogLine } from '../../../model/entities/lab-log.entity';
import { MatTooltip } from '@angular/material/tooltip';
import { FlDateModule } from '../../../../../../../../libs/front-core-lib/src/lib/module/fl-date/fl-date.module';

@Component({
  selector: 'lab-log-lines',
  templateUrl: './lab-log-lines.component.html',
  styleUrl: './lab-log-lines.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatTooltip, FlDateModule],
})
export class LabLogLinesComponent {
  logLines = input.required<LabLogLine[]>();

  showScenarioId = input<boolean>(true);
}
