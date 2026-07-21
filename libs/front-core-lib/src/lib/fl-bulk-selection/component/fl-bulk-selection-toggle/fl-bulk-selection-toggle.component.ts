import { ChangeDetectionStrategy,Component, inject } from '@angular/core';

import { FlBulkSelectionState } from '../../state/fl-bulk-selection.state';

@Component({
  selector: 'fl-bulk-selection-toggle',
  templateUrl: './fl-bulk-selection-toggle.component.html',
  styleUrls: ['./fl-bulk-selection-toggle.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class FlBulkSelectionToggleComponent {
  state = inject(FlBulkSelectionState);

  toggle(): void {
    this.state.setSelectionMode(!this.state.selectionMode());
  }
}
