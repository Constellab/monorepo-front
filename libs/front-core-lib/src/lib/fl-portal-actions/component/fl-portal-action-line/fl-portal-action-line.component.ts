import { ChangeDetectionStrategy, Component, inject, Input, OnDestroy, OnInit } from '@angular/core';
import {
  FlConfirmDialogInput,
  FlConfirmDialogResult,
  FlDialogService,
} from '@monorepo/front-core-lib/fl-dialog';
import { FlTranslatableText } from '@monorepo/front-core-lib/fl-translate';
import { Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';

import { FlPortalActionDetail } from '../../model/fl-portal-action-detail.class';
import {
  FlPortalActionDetailStatusEvent,
  FlPortalActionProcessing,
  FlPortalActionSuccess,
} from '../../model/fl-portal-actions.class';

/**
 * Component inside {@link FlPortalActionsComponent} that subscribe
 * and show loader for one observable
 */
@Component({
  selector: 'fl-portal-action-line',
  templateUrl: './fl-portal-action-line.component.html',
  styleUrls: ['./fl-portal-action-line.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class FlPortalActionLineComponent implements OnInit, OnDestroy {
  @Input() action: FlPortalActionDetail;

  statusEvent$: Observable<FlPortalActionDetailStatusEvent>;
  link$: Observable<string | null | undefined>;
  displayedText$: Observable<FlTranslatableText>;
  currentOnSuccessClick: (() => void) | null = null;

  private dialogService = inject(FlDialogService);
  private resultSubscription: Subscription;

  ngOnInit(): void {
    this.statusEvent$ = this.action.getStatusEvent$();
    this.link$ = this.action
      .getResult$()
      .pipe(map((result) => (result.status === 'success' ? result.link : null)));
    this.resultSubscription = this.action.getResult$().subscribe((result) => {
      if (result.status === 'success') {
        const success = result as FlPortalActionSuccess;
        this.currentOnSuccessClick = success.onSuccessClick ?? null;
      }
    });
    this.displayedText$ = this.statusEvent$.pipe(
      map((event) => {
        if (event.status === 'processing') {
          const message = (event as FlPortalActionProcessing).message;
          if (message) return message;
        }
        if (event.status === 'success') {
          const successMessage = (event as FlPortalActionSuccess).successMessage;
          if (successMessage) return successMessage;
        }
        return this.action.text;
      })
    );
  }

  onLineClick(): void {
    if (this.currentOnSuccessClick) {
      this.currentOnSuccessClick();
    }
  }

  /**
   * Keyboard activation for the button-role line. Dispatches a real click so that
   * both onLineClick() and the routerLink navigation run, exactly like a mouse click.
   * Space also prevents the default page scroll.
   */
  onLineKeydown(event: Event): void {
    event.preventDefault();
    (event.currentTarget as HTMLElement).click();
  }

  ngOnDestroy(): void {
    this.resultSubscription?.unsubscribe();
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
