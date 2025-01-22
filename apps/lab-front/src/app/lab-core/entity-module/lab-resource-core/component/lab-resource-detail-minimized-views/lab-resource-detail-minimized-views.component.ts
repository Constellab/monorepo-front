import { Component, Signal, inject } from '@angular/core';
import { LabMinimizedView, LabResourceDetailState } from '../../state/lab-resource-detail.state';
import { FlMouseButton } from '@monorepo/front-core-lib';
import { MatRipple } from '@angular/material/core';
import { MatTooltip } from '@angular/material/tooltip';
import { TdTechnicalDocModule } from '../../../../../../../../../libs/technical-doc/src/lib/td-technical-doc.module';

/**
 * Component inside the resource detail to list the minimized views
 */
@Component({
  selector: 'lab-resource-detail-minimized-views',
  templateUrl: './lab-resource-detail-minimized-views.component.html',
  styleUrls: ['./lab-resource-detail-minimized-views.component.scss'],
  imports: [MatRipple, MatTooltip, TdTechnicalDocModule],
})
export class LabResourceDetailMinimizedViewsComponent {
  private state = inject(LabResourceDetailState);

  minimizedViews: Signal<LabMinimizedView[]> = this.state.minimizedViews;

  openView(view: LabMinimizedView): void {
    this.state.openMinimizedView(view);
  }

  private deleteView(view: LabMinimizedView): void {
    this.state.deleteMinimizedView(view.symbol);
  }

  onAuxClick(view: LabMinimizedView, event: MouseEvent): void {
    if (event.button === FlMouseButton.MIDDLE) {
      this.deleteView(view);
    }
  }
}
