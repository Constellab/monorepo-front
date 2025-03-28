import { Component, Input } from '@angular/core';
import { FlDateModule } from '@monorepo/front-core-lib/fl-date';
import { FlKeyValueModule } from '@monorepo/front-core-lib/fl-key-value';
import { LiLogLinesComponent } from '../li-log-lines/li-log-lines.component';
import { LiLogsBetweenDates } from '@monorepo/lab-lib/li-core';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'li-logs-between-dates',
  templateUrl: './li-logs-between-dates.component.html',
  styleUrls: ['./li-logs-between-dates.component.scss'],
  imports: [FlKeyValueModule, LiLogLinesComponent, TranslatePipe, FlDateModule],
})
export class LiLogsBetweenDatesComponent {
  @Input() logs: LiLogsBetweenDates;
}
