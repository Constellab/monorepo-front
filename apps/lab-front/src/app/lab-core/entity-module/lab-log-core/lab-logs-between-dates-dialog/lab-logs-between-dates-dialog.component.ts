import {Component, Inject, OnInit} from '@angular/core';
import {Observable} from 'rxjs';
import {LabLogsBetweenDates} from '../../../model/entities/lab-log.entity';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';
import {DateTime} from 'luxon';


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
  styleUrls: ['./lab-logs-between-dates-dialog.component.scss']
})
export class LabLogsBetweenDatesDialogComponent implements OnInit {

  title: string;
  loadFunction: (lastDate?: DateTime) => Observable<LabLogsBetweenDates>;
  downloadUrl?: string;

  isLoading: boolean = false;
  logs: LabLogsBetweenDates;

  constructor(@Inject(MAT_DIALOG_DATA) input: LabLogBetweenDatesDialogInput) {
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
      next: logs => this.onSuccess(logs),
      error: () => this.onError()
    });
  }

  private onSuccess(logs: LabLogsBetweenDates): void {
    if (this.logs) {
      // if this is a new page load we update the existing logs
      this.logs.logs.push(...logs.logs);
      this.logs.isLastPage = logs.isLastPage;
      this.logs.nextPageDate = logs.nextPageDate;
    } else {
      this.logs = logs;
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
