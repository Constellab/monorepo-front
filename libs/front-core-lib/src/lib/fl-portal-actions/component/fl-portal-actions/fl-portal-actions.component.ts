import { Component, OnInit, TrackByFunction, inject } from '@angular/core';
import { FlPortalActionDetail } from '../../model/fl-portal-actions.class';
import { Observable } from 'rxjs';
import { FlPortalActionsState } from '../../service/fl-portal-actions.state';

/**
 * Portal that pop at the bottom right of the screen that takes
 * to show the current actions
 */
@Component({
  selector: 'fl-portal-actions',
  templateUrl: './fl-portal-actions.component.html',
  styleUrls: ['./fl-portal-actions.component.scss'],
  standalone: false,
})
export class FlPortalActionsComponent {
  private actionsState = inject(FlPortalActionsState);

  actions$: Observable<FlPortalActionDetail[]>;

  constructor() {
    const actionsState = this.actionsState;

    this.actions$ = actionsState.getActions$();
  }

  // track the action with symboles
  trackBySymbole: TrackByFunction<FlPortalActionDetail> = (index: number, item: FlPortalActionDetail) => {
    return item.symbol;
  };
}
