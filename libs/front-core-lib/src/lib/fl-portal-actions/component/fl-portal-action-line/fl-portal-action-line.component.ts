import { Component, inject, Input, OnInit } from '@angular/core';
import {
  FlConfirmDialogInput,
  FlConfirmDialogResult,
  FlDialogService,
} from '@monorepo/front-core-lib/fl-dialog';
import { FlTranslatableText } from '@monorepo/front-core-lib/fl-translate';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { FlPortalActionDetail } from '../../model/fl-portal-action-detail.class';
import {
  FlPortalActionDetailStatusEvent,
  FlPortalActionProcessing,
} from '../../model/fl-portal-actions.class';

/**
 * Component inside {@link FlPortalActionsComponent} that subscribe
 * and show loader for one observable
 */
@Component({
  selector: 'fl-portal-action-line',
  templateUrl: './fl-portal-action-line.component.html',
  styleUrls: ['./fl-portal-action-line.component.scss'],
  standalone: false,
})
export class FlPortalActionLineComponent implements OnInit {
  @Input() action: FlPortalActionDetail;

  statusEvent$: Observable<FlPortalActionDetailStatusEvent>;
  link$: Observable<string | null>;
  displayedText$: Observable<FlTranslatableText>;

  private dialogService = inject(FlDialogService);

  ngOnInit(): void {
    this.statusEvent$ = this.action.getStatusEvent$();
    this.link$ = this.action
      .getResult$()
      .pipe(map((result) => (result.status === 'success' ? result.link : null)));
    this.displayedText$ = this.statusEvent$.pipe(
      map((event) => {
        if (event.status === 'processing' && (event as FlPortalActionProcessing).message) {
          return (event as FlPortalActionProcessing).message;
        }
        return this.action.text;
      })
    );
  }

  cancelAction(): void {
    const dialogInput: FlConfirmDialogInput = {
      title: 'flPortalAction.cancelAction',
      content: 'flPortalAction.cancelActionConfirmation',
    };

    this.dialogService
      .openConfirmDialog(dialogInput)
      .afterClosed()
      .subscribe((result: FlConfirmDialogResult) => {
        if (result.choice) {
          this.action.cancel();
        }
      });
  }
}
