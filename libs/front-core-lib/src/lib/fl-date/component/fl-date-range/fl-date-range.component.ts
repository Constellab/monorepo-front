import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { ClOnChange } from '@monorepo/core-lib';
import { DateTime } from 'luxon';

import { FlDateFormatKey } from '../../pipe/fl-date/fl-date.pipe';

/**
 * Display a date range with text,
 * Support different mode where there is no start or end date
 */
@Component({
  selector: 'fl-date-range',
  templateUrl: './fl-date-range.component.html',
  styleUrls: ['./fl-date-range.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class FlDateRangeComponent implements OnInit {
  @ClOnChange(function (this: FlDateRangeComponent) {
    this.initMode();
  })
  @Input()
  startingDate?: DateTime;

  @ClOnChange(function (this: FlDateRangeComponent) {
    this.initMode();
  })
  @Input()
  endingDate?: DateTime;

  @Input() dateFormat: FlDateFormatKey = 'DATE';

  mode: 'between' | 'from' | 'to' | null;

  ngOnInit(): void {
    this.initMode();
  }

  private initMode(): void {
    if (this.startingDate != null && this.endingDate != null) {
      this.mode = 'between';
    } else if (this.startingDate == null) {
      this.mode = 'to';
    } else if (this.endingDate == null) {
      this.mode = 'from';
    } else {
      this.mode = null;
    }
  }
}
