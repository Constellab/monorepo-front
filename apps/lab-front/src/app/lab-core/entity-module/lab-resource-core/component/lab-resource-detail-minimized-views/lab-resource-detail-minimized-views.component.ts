import { Component, Signal } from '@angular/core';
import { LabMinimizedView, LabResourceDetailState } from '../../state/lab-resource-detail.state';
import { FlMouseButton } from '@monorepo/front-core-lib';

/**
 * Component inside the resource detail to list the minimized views
 */
@Component({
    selector: 'lab-resource-detail-minimized-views',
    templateUrl: './lab-resource-detail-minimized-views.component.html',
    styleUrls: ['./lab-resource-detail-minimized-views.component.scss'],
    standalone: false
})
export class LabResourceDetailMinimizedViewsComponent {
  minimizedViews: Signal<LabMinimizedView[]> = this.state.minimizedViews;

  constructor(private state: LabResourceDetailState) {}

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
