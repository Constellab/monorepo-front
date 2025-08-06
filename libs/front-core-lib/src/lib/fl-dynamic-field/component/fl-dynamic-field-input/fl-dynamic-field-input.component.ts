import { Component, Input } from '@angular/core';

import { FlDynamicFieldAbstractDirective } from '../../model/fl-dynamic-field-abstract.directive';

@Component({
  selector: 'fl-dynamic-field-input',
  templateUrl: './fl-dynamic-field-input.component.html',
  styleUrls: ['./fl-dynamic-field-input.component.scss'],
  standalone: false,
})
export class FlDynamicFieldInputComponent extends FlDynamicFieldAbstractDirective {
  @Input() prefix: string;

  @Input() suffix: string;

  @Input() inputType: 'text' | 'number';

  @Input() min: number;

  @Input() max: number;

  @Input() integer: boolean;
}
