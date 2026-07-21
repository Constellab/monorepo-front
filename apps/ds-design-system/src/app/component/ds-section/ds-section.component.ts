import { ChangeDetectionStrategy,Component, input } from '@angular/core';

/**
 * A titled section used to group a set of showcased components.
 * Each override family (buttons, form fields, table, ...) is rendered inside one.
 */
@Component({
  selector: 'ds-section',
  templateUrl: './ds-section.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './ds-section.component.scss',
})
export class DsSectionComponent {
  readonly title = input.required<string>();
  readonly description = input<string>('');
}
