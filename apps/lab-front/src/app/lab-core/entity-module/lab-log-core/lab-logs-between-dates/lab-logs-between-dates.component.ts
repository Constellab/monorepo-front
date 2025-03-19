import { Component, Input } from '@angular/core';
import { LabLogsBetweenDates } from '../../../model/entities/lab-log.entity';
import { FlKeyValueModule } from '@monorepo/front-core-lib/fl-key-value';
import { LabLogLinesComponent } from '../lab-log-lines/lab-log-lines.component';
import { TranslatePipe } from '@ngx-translate/core';
import { FlDateModule } from '@monorepo/front-core-lib/fl-date';

@Component({
  selector: 'lab-logs-between-dates',
  templateUrl: './lab-logs-between-dates.component.html',
  styleUrls: ['./lab-logs-between-dates.component.scss'],
  imports: [FlKeyValueModule, LabLogLinesComponent, TranslatePipe, FlDateModule],
})
export class LabLogsBetweenDatesComponent {
  @Input() logs: LabLogsBetweenDates;
}
