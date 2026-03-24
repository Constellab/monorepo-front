import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { FlDateModule } from '@monorepo/front-core-lib/fl-date';
import { LiLogLine } from '@monorepo/lab-lib/li-core';
import { TranslatePipe } from '@ngx-translate/core';

import { LiLogLineContentComponent } from '../li-log-line-content/li-log-line-content.component';

@Component({
  selector: 'li-log-lines',
  templateUrl: './li-log-lines.component.html',
  styleUrl: './li-log-lines.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FlDateModule, LiLogLineContentComponent, TranslatePipe],
})
export class LiLogLinesComponent {
  logLines = input.required<LiLogLine[]>();

  showContext = input<boolean>(true);
}
