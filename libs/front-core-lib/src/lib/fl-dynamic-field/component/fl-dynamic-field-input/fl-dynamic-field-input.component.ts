import { Component, input } from '@angular/core';

import { FlDynamicFieldAbstractDirective } from '../../model/fl-dynamic-field-abstract.directive';

@Component({
  selector: 'fl-dynamic-field-input',
  templateUrl: './fl-dynamic-field-input.component.html',
  styleUrls: ['./fl-dynamic-field-input.component.scss'],
  standalone: false,
  host: { '[class.cell-rendering]': 'cellRendering()' },
})
export class FlDynamicFieldInputComponent extends FlDynamicFieldAbstractDirective {
  prefix = input<string>();

  suffix = input<string>();

  inputType = input<'text' | 'number'>();

  min = input<number>();

  max = input<number>();

  integer = input<boolean>();

  minLength = input<number>();

  maxLength = input<number>();

  regex = input<string>();

  regexDescription = input<string>();

  override get errorMessage(): string {
    const ctrl = this.formCtrl();
    if (!ctrl) {
      return '';
    }
    if (ctrl.hasError('min')) {
      return this.translateService.translate('flDynamicField.min_error_validator', {
        param: { min: ctrl.getError('min').min },
      });
    }
    if (ctrl.hasError('max')) {
      return this.translateService.translate('flDynamicField.max_error_validator', {
        param: { max: ctrl.getError('max').max },
      });
    }
    if (ctrl.hasError('notInteger')) {
      return this.translateService.translate('flDynamicField.integer_error_validator');
    }
    if (ctrl.hasError('minlength')) {
      return this.translateService.translate('flDynamicField.min_length_error_validator', {
        param: { minLength: ctrl.getError('minlength').requiredLength },
      });
    }
    if (ctrl.hasError('maxlength')) {
      return this.translateService.translate('flDynamicField.max_length_error_validator', {
        param: { maxLength: ctrl.getError('maxlength').requiredLength },
      });
    }
    if (ctrl.hasError('pattern')) {
      return (
        this.regexDescription() || this.translateService.translate('flDynamicField.pattern_error_validator')
      );
    }
    return super.errorMessage;
  }
}
