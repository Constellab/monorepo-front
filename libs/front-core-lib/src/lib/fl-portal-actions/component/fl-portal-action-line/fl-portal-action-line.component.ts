import { Component, inject, Input, OnInit } from '@angular/core';
import {
  FlConfirmDialogInput,
  FlConfirmDialogResult,
  FlDialogService,
} from '@monorepo/front-core-lib/fl-dialog';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { FlPortalActionDetail, FlPortalActionDetailStatusEvent } from '../../model/fl-portal-actions.class';

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

  private dialogService = inject(FlDialogService);

  ngOnInit(): void {
    this.statusEvent$ = this.action.getStatusEvent$();
    this.link$ = this.action
      .getResult$()
      .pipe(map((result) => (result.status === 'success' ? result.link : null)));
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
