import { ChangeDetectionStrategy,Component, inject, OnDestroy, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FlTranslatableText } from '@monorepo/front-core-lib/fl-translate';
import { Observable, share, Subject, switchMap, takeUntil, timer } from 'rxjs';

import { LmlDockerLogs } from '../../model/lml-lab-manager.class';

export interface LmlDockerContainerLogsInput {
  title: FlTranslatableText;
  getLogs: () => Observable<LmlDockerLogs>;
  refreshInterval: number;
}

/**
 * Dialog to view logs of a docker container
 */
@Component({
  selector: 'lml-docker-container-logs-dialog',
  templateUrl: './lml-docker-container-logs-dialog.component.html',
  styleUrls: ['./lml-docker-container-logs-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class LmlDockerContainerLogsDialogComponent implements OnInit, OnDestroy {
  input: LmlDockerContainerLogsInput = inject(MAT_DIALOG_DATA);

  logs$: Observable<LmlDockerLogs>;

  private destroy$ = new Subject<void>();

  ngOnInit(): void {
    this.logs$ = timer(0, this.input.refreshInterval).pipe(
      switchMap(() => this.input.getLogs()),
      takeUntil(this.destroy$),
      share()
    );
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
