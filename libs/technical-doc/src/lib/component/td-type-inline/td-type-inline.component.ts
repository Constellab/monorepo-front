import { Component, Input } from '@angular/core';
import { TdTypeStyle, tdTypeStyleDefault } from '../../model/td-type.class';

/**
 * Simple component to show a chip for a type
 */
@Component({
    selector: 'td-type-inline',
    templateUrl: './td-type-inline.component.html',
    styleUrl: './td-type-inline.component.scss',
    standalone: false
})
export class tdTypeInlineComponent {
  @Input({ required: true }) text: string;

  @Input({ required: true }) style: TdTypeStyle;

  @Input() subText: string;

  get styleWithDefault(): TdTypeStyle {
    return this.style ?? tdTypeStyleDefault;
  }
}
