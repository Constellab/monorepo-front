import { ChangeDetectionStrategy,Component, inject } from '@angular/core';
import { FlOverlayRef } from '@monorepo/front-core-lib/fl-portal';

import { FlBulkActionButton } from '../../model/fl-bulk-selection.model';
import { FlBulkSelectionState } from '../../state/fl-bulk-selection.state';

@Component({
  selector: 'fl-bulk-selection-portal',
  templateUrl: './fl-bulk-selection-portal.component.html',
  styleUrls: ['./fl-bulk-selection-portal.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class FlBulkSelectionPortalComponent {
  state = inject(FlBulkSelectionState);
  private overlayRef = inject(FlOverlayRef);

  onAction(action: FlBulkActionButton): void {
    this.state.triggerAction(action);
  }

  close(): void {
    this.overlayRef.dispose();
  }
}
