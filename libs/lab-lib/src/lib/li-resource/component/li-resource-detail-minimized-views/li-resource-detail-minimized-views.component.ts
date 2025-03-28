import { Component, Signal, inject } from '@angular/core';
import { FlMouseButton } from '@monorepo/front-core-lib/fl-core';
import { LiMinimizedView, LiResourceDetailState } from '../../state/li-resource-detail.state';
import { MatRipple } from '@angular/material/core';
import { MatTooltip } from '@angular/material/tooltip';
import { TdTechnicalDocModule } from '@monorepo/technical-doc';

/**
 * Component inside the resource detail to list the minimized views
 */
@Component({
  selector: 'li-resource-detail-minimized-views',
  templateUrl: './li-resource-detail-minimized-views.component.html',
  styleUrls: ['./li-resource-detail-minimized-views.component.scss'],
  imports: [MatRipple, MatTooltip, TdTechnicalDocModule],
})
export class LiResourceDetailMinimizedViewsComponent {
  private state = inject(LiResourceDetailState);

  minimizedViews: Signal<LiMinimizedView[]> = this.state.minimizedViews;

  openView(view: LiMinimizedView): void {
    this.state.openMinimizedView(view);
  }

  private deleteView(view: LiMinimizedView): void {
    this.state.deleteMinimizedView(view.symbol);
  }

  onAuxClick(view: LiMinimizedView, event: MouseEvent): void {
    if (event.button === FlMouseButton.MIDDLE) {
      this.deleteView(view);
    }
  }
}
