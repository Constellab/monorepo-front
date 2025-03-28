import { Component, OnInit, inject } from '@angular/core';
import { DateTime } from 'luxon';
import { FlDialogModule } from '@monorepo/front-core-lib/fl-dialog';
import { FlInfiniteScrollModule } from '@monorepo/front-core-lib/fl-infinite-scroll';
import { FlLoaderModule } from '@monorepo/front-core-lib/fl-loader';
import { LiLogsBetweenDates } from '@monorepo/lab-lib/li-core';
import { LiLogsBetweenDatesComponent } from '../li-logs-between-dates/li-logs-between-dates.component';
import { MAT_DIALOG_DATA, MatDialogContent } from '@angular/material/dialog';
import { MatButton, MatIconAnchor } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatTooltip } from '@angular/material/tooltip';
import { Observable } from 'rxjs';
import { TranslatePipe } from '@ngx-translate/core';

export interface LiLogBetweenDatesDialogInput {
  title: string;
  loadFunction: (fromDatePage?: DateTime) => Observable<LiLogsBetweenDates>;
  downloadUrl?: string;
}

/**
 * Dialog to show logs between 2 dates useful to see the process logs
 */
@Component({
  selector: 'li-logs-between-dates-dialog',
  templateUrl: './li-logs-between-dates-dialog.component.html',
  styleUrls: ['./li-logs-between-dates-dialog.component.scss'],
  imports: [
    FlDialogModule,
    MatIconAnchor,
    MatTooltip,
    MatIcon,
    MatDialogContent,
    FlInfiniteScrollModule,
    LiLogsBetweenDatesComponent,
    MatButton,
    FlLoaderModule,
    TranslatePipe,
  ],
})
export class LiLogsBetweenDatesDialogComponent implements OnInit {
  title: string;
  loadFunction: (lastDate?: DateTime) => Observable<LiLogsBetweenDates>;
  downloadUrl?: string;

  isLoading: boolean = false;
  logs: LiLogsBetweenDates;

  constructor() {
    const input = inject<LiLogBetweenDatesDialogInput>(MAT_DIALOG_DATA);

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

  private onSuccess(logs: LiLogsBetweenDates): void {
    if (this.logs) {
      // if this is a new page load we update the existing logs
      this.logs.logs.push(...logs.logs);
    } else {
      this.logs = logs;
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
