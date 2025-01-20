import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { LabLogLine } from '../../../model/entities/lab-log.entity';

@Component({
    selector: 'lab-log-lines',
    templateUrl: './lab-log-lines.component.html',
    styleUrl: './lab-log-lines.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
})
export class LabLogLinesComponent {
  logLines = input.required<LabLogLine[]>();

  showScenarioId = input<boolean>(true);
}
