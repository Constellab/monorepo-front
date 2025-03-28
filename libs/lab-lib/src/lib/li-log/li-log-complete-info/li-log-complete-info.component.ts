import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { FlCorePipeModule } from '@monorepo/front-core-lib/fl-core-pipe';
import { FlKeyValueModule } from '@monorepo/front-core-lib/fl-key-value';
import { LiLogCompleteInfo } from '@monorepo/lab-lib/li-core';
import { LiLogLinesComponent } from '../li-log-lines/li-log-lines.component';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'li-log-complete-info',
  templateUrl: './li-log-complete-info.component.html',
  styleUrls: ['./li-log-complete-info.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FlKeyValueModule, LiLogLinesComponent, FlCorePipeModule, TranslatePipe],
})
export class LiLogCompleteInfoComponent {
  @Input({ required: true }) log: LiLogCompleteInfo;
}
