import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { FlDateModule } from '@monorepo/front-core-lib/fl-date';
import { LiLogLine } from '@monorepo/lab-lib/li-core';
import { MatTooltip } from '@angular/material/tooltip';

@Component({
  selector: 'li-log-lines',
  templateUrl: './li-log-lines.component.html',
  styleUrl: './li-log-lines.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatTooltip, FlDateModule],
})
export class LiLogLinesComponent {
  logLines = input.required<LiLogLine[]>();

  showContext = input<boolean>(true);
}
