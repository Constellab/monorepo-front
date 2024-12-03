import { FlDynamicFormAbstractControl } from './fl-dynamic-field-config.class';
import { AbstractControl } from '@angular/forms';
import { Signal } from '@angular/core';

/**
 * Generic type for the Dynamic control components
 */
export interface FlDynamicAbstractFormDirective {
  config: Signal<FlDynamicFormAbstractControl>;

  control: Signal<AbstractControl>;

  configName?: Signal<string>;
}
