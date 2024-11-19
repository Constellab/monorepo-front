import { Component, input, output } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import {
  FlDynamicEditableFormGroupConfig,
  FlDynamicFormAbstractControl,
  FlDynamicFormGroupConfig,
} from '../../model/fl-dynamic-field-config.class';
import { FlDynamicAbstractFormDirective } from '../../model/fl-dynamic-abstract-form.directive';

/**
 * Component to create dynamic form group
 */
@Component({
  selector: 'fl-dynamic-form-group',
  templateUrl: './fl-dynamic-form-group.component.html',
  styleUrls: ['./fl-dynamic-form-group.component.scss'],
})
export class FlDynamicFormGroupComponent implements FlDynamicAbstractFormDirective {
  /**
   * Form where control will be added
   */

  control = input<UntypedFormGroup>();

  config = input<FlDynamicFormGroupConfig | FlDynamicEditableFormGroupConfig>();

  openEditParamSpecsDialog = output();

  getControlClass(config: FlDynamicFormAbstractControl): string {
    // different classe based on type
    // if FormGroup or FormArray --> width 100%
    // else width flex 1
    if (config.controlType === 'formControl') {
      if (config.fullWidth) {
        return 'group-container';
      }
      return 'field-container';
    }
    return 'group-container';
  }

  emitOpenEditParamSpecsDialog(): void {
    this.openEditParamSpecsDialog.emit();
  }
}
