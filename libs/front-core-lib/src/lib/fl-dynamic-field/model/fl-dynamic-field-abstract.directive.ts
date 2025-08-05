import { Directive, Input } from '@angular/core';
import { FormControl } from '@angular/forms';

/**
 * Generic type for the Dynamic control components
 */
@Directive()
export class FlDynamicFieldAbstractDirective {
  @Input() formCtrl: FormControl;

  @Input() placeholder: string;

  @Input() hint: string;

  @Input() disabled: boolean;

  @Input() required: boolean;
}
