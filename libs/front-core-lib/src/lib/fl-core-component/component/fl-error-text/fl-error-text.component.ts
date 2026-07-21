import { ChangeDetectionStrategy,Component, Input } from '@angular/core';

/**
 * Simple component to show an error message
 */
@Component({
  selector: 'fl-error-text',
  templateUrl: './fl-error-text.component.html',
  styleUrls: ['./fl-error-text.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class FlErrorTextComponent {
  @Input() errorMessage: string;
}
