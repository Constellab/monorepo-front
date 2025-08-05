import { Component, input } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { FlDynamicAbstractFormDirective } from '../../model/fl-dynamic-abstract-form.directive';
import {
  FlDynamicEditableFormGroupConfig,
  FlDynamicFormAbstractControl,
  FlDynamicFormGroupConfig,
} from '../../model/fl-dynamic-field-config.class';

/**
 * Component to create dynamic form group
 */
@Component({
  selector: 'fl-dynamic-form-group',
  templateUrl: './fl-dynamic-form-group.component.html',
  styleUrls: ['./fl-dynamic-form-group.component.scss'],
  standalone: false,
})
export class FlDynamicFormGroupComponent implements FlDynamicAbstractFormDirective {
  /**
   * Form where control will be added
   */

  control = input.required<FormGroup>();

  config = input.required<FlDynamicFormGroupConfig | FlDynamicEditableFormGroupConfig>();

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
}
