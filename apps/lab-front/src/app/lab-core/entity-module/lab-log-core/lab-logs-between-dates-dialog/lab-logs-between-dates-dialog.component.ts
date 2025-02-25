import { Component, inject, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { LabLogsBetweenDates } from '../../../model/entities/lab-log.entity';
import { MAT_DIALOG_DATA, MatDialogContent } from '@angular/material/dialog';
import { DateTime } from 'luxon';
import { FlDialogModule } from '@monorepo/front-core-lib/fl-dialog';
import { MatButton, MatIconAnchor } from '@angular/material/button';
import { MatTooltip } from '@angular/material/tooltip';
import { MatIcon } from '@angular/material/icon';
import { FlInfiniteScrollModule } from '@monorepo/front-core-lib/fl-infinite-scroll';
import { LabLogsBetweenDatesComponent } from '../lab-logs-between-dates/lab-logs-between-dates.component';
import { FlLoaderModule } from '@monorepo/front-core-lib/fl-loader';
import { TranslatePipe } from '@ngx-translate/core';

export interface LabLogBetweenDatesDialogInput {
  title: string;
  loadFunction: (fromDatePage?: DateTime) => Observable<LabLogsBetweenDates>;
  downloadUrl?: string;
}

/**
 * Dialog to show logs between 2 dates useful to see the process logs
 */
@Component({
  selector: 'lab-logs-between-dates-dialog',
  templateUrl: './lab-logs-between-dates-dialog.component.html',
  styleUrls: ['./lab-logs-between-dates-dialog.component.scss'],
  imports: [
    FlDialogModule,
    MatIconAnchor,
    MatTooltip,
    MatIcon,
    MatDialogContent,
    FlInfiniteScrollModule,
    LabLogsBetweenDatesComponent,
    MatButton,
    FlLoaderModule,
    TranslatePipe,
  ],
})
export class LabLogsBetweenDatesDialogComponent implements OnInit {
  title: string;
  loadFunction: (lastDate?: DateTime) => Observable<LabLogsBetweenDates>;
  downloadUrl?: string;

  isLoading: boolean = false;
  logs: LabLogsBetweenDates;

  constructor() {
    const input = inject<LabLogBetweenDatesDialogInput>(MAT_DIALOG_DATA);

    this.title = input.title;
    this.loadFunction = input.loadFunction;
    this.downloadUrl = input.downloadUrl;
  }

  ngOnInit(): void {
    this.loadLogs();
  }

  loadNextPage(): void {
    if (this.logs) {
      this.loadLogs(this.logs.nextPageDate);
    }
  }

  private loadLogs(lastDate?: DateTime): void {
    if (this.isLoading) return;
    this.isLoading = true;
    this.loadFunction(lastDate).subscribe({
      next: (logs) => this.onSuccess(logs),
      error: () => this.onError(),
    });
  }

  private onSuccess(logs: LabLogsBetweenDates): void {
    if (this.logs) {
      // if this is a new page load we update the existing logs
      this.logs.logs.push(...logs.logs);
    } else {
      this.logs = logs;
      this.logs.logs = [];
    }
    this.logs.isLastPage = logs.isLastPage;
    if (!this.logs.isLastPage) {
      this.logs.nextPageDate = logs.logs[logs.logs.length - 1].datetime.plus({ milliseconds: 1 }) as DateTime;
    }
    this.isLoading = false;
  }

  private onError(): void {
    this.isLoading = false;
  }

  get loadNextPageDisabled(): boolean {
    return this.isLoading || this.logs?.isLastPage;
  }
}
