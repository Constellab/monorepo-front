import { Component, Input, OnInit } from '@angular/core';
import { LabLogsBetweenDates } from '../../../model/entities/lab-log.entity';
import { FlKeyValueModule } from '../../../../../../../../libs/front-core-lib/src/lib/module/fl-key-value/fl-key-value.module';
import { LabLogLinesComponent } from '../lab-log-lines/lab-log-lines.component';
import { TranslatePipe } from '@ngx-translate/core';
import { FlDateModule } from '../../../../../../../../libs/front-core-lib/src/lib/module/fl-date/fl-date.module';

@Component({
  selector: 'lab-logs-between-dates',
  templateUrl: './lab-logs-between-dates.component.html',
  styleUrls: ['./lab-logs-between-dates.component.scss'],
  imports: [FlKeyValueModule, LabLogLinesComponent, TranslatePipe, FlDateModule],
})
export class LabLogsBetweenDatesComponent implements OnInit {
  @Input() logs: LabLogsBetweenDates;

  constructor() {}

  ngOnInit(): void {}
}
