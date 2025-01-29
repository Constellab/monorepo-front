import { Component, inject } from '@angular/core';
import { FlPortalActionDetail } from '../../model/fl-portal-actions.class';
import { Observable } from 'rxjs';
import { FlPortalActionsState } from '../../service/fl-portal-actions.state';
import { FlPortalActionsService } from '../../service/fl-portal-actions.service';

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
  actions$: Observable<FlPortalActionDetail[]> = inject(FlPortalActionsState).getActions$();

  private actionPortalService = inject(FlPortalActionsService);

  portalIsReduced: boolean = false;

  closePortal(): void {
    this.actionPortalService.closeActionsPortal();
  }

  toggleReducePortal(): void {
    this.portalIsReduced = !this.portalIsReduced;
  }
}
