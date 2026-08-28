import { ChangeDetectionStrategy, Component, computed, inject, OnInit, signal } from '@angular/core';
import { MatButton, MatIconAnchor } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogContent } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { MatTooltip } from '@angular/material/tooltip';
import { FlDialogModule } from '@monorepo/front-core-lib/fl-dialog';
import { FlInfiniteScrollModule } from '@monorepo/front-core-lib/fl-infinite-scroll';
import { FlLoaderModule } from '@monorepo/front-core-lib/fl-loader';
import { LiLogsBetweenDates } from '@monorepo/lab-lib/li-core';
import { TranslatePipe } from '@ngx-translate/core';
import { DateTime } from 'luxon';
import { Observable } from 'rxjs';

import { LiLogsBetweenDatesComponent } from '../li-logs-between-dates/li-logs-between-dates.component';

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
  changeDetection: ChangeDetectionStrategy.Eager,
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
  private input = inject<LiLogBetweenDatesDialogInput>(MAT_DIALOG_DATA);

  title = signal(this.input.title);
  downloadUrl = signal(this.input.downloadUrl);
  isLoading = signal(false);
  logs = signal<LiLogsBetweenDates | undefined>(undefined);
  loadNextPageDisabled = computed(() => this.isLoading() || (this.logs()?.isLastPage ?? false));

  private loadFunction = this.input.loadFunction;

  ngOnInit(): void {
    this.loadLogs();
  }

  loadNextPage(): void {
    const logs = this.logs();
    if (logs) {
      this.loadLogs(logs.nextPageDate);
    }
  }

  private loadLogs(lastDate?: DateTime): void {
    if (this.isLoading()) return;
    this.isLoading.set(true);
    this.loadFunction(lastDate).subscribe({
      next: (logs) => this.onSuccess(logs),
      error: () => this.onError(),
    });
  }

  private onSuccess(newLogs: LiLogsBetweenDates): void {
    const currentLogs = this.logs();
    const mergedLogLines = currentLogs ? [...currentLogs.logs, ...newLogs.logs] : newLogs.logs;
    const nextPageDate = !newLogs.isLastPage
      ? (newLogs.logs[newLogs.logs.length - 1].datetime.plus({ milliseconds: 1 }) as DateTime)
      : newLogs.nextPageDate;

    this.logs.set({
      ...newLogs,
      logs: mergedLogLines,
      nextPageDate,
    });
    this.isLoading.set(false);
  }

  private onError(): void {
    this.isLoading.set(false);
  }
}
