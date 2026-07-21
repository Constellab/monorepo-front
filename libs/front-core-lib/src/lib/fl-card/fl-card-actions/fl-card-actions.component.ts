import { ChangeDetectionStrategy,Component } from '@angular/core';

/**
 * The actions on top right of the <fl-card> {@link FlCardComponent}
 *
 * Child of the <fl-card-header> {@link FlCardHeaderComponent}
 */
@Component({
  selector: 'fl-card-actions',
  templateUrl: './fl-card-actions.component.html',
  styleUrls: ['./fl-card-actions.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class FlCardActionsComponent {}
