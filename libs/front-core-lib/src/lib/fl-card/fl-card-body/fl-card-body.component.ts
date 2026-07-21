import { ChangeDetectionStrategy,Component } from '@angular/core';

/**
 * Body of the card component <fl-card> {@link FlCardComponent}
 */
@Component({
  selector: 'fl-card-body',
  templateUrl: './fl-card-body.component.html',
  styleUrls: ['./fl-card-body.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class FlCardBodyComponent {}
