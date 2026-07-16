import { Component, input } from '@angular/core';

/**
 * Wraps a single showcased variant with a caption describing the class /
 * override it demonstrates, so the page doubles as living documentation.
 */
@Component({
  selector: 'ds-example',
  templateUrl: './ds-example.component.html',
  styleUrl: './ds-example.component.scss',
})
export class DsExampleComponent {
  /** Human label for the variant (e.g. "Small button"). */
  readonly label = input.required<string>();
  /** The class / selector the variant demonstrates (e.g. ".g-button-small"). */
  readonly code = input<string>('');
}
