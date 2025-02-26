import { Signal } from '@angular/core';

/**
 * Generic config for a FormGroup, FormArray or FormControl
 */
export type FlDynamicFormAbstractControl =
  | FlDynamicFormGroupConfig
  | FlDynamicFormArrayConfig
  | FlDynamicFieldConfig
  | FlDynamicEditableFormGroupConfig;

/**
 * Base object for configs
 */
interface FlDynamicFormConfigBase {
  controlType: 'formControl' | 'formGroup' | 'formArray' | 'editableFormGroup';
  placeholder?: string;
  hint?: string;
}

export interface FlFormGroupConfig extends FlDynamicFormConfigBase {
  subConfigs: Record<string, FlDynamicFormAbstractControl>;
}

/**
 * Config for a FormGroup
 */
export interface FlDynamicFormGroupConfig extends FlFormGroupConfig {
  controlType: 'formGroup';
}

/**
 * Config for an editable FormGroup (used for dynamic forms)
 */
export interface FlDynamicEditableFormGroupConfig extends FlFormGroupConfig {
  controlType: 'editableFormGroup';
}

/**
 * Config for a FormArray
 */
export interface FlDynamicFormArrayConfig extends FlDynamicFormConfigBase {
  controlType: 'formArray';
  formGpConfig: FlDynamicFormGroupConfig;
  minSize?: number; // if set the formArray must contain at least minSize number
  maxSize?: number; // if set the formArray can't contain more than maxSize values
  newElementDefaultValue?: any; // value used to initialize a new element in the array
}

/**
 * Configuration for a FormControl
 */
export type FlDynamicFieldConfig =
  | FlDynamicFieldConfigInput
  | FlDynamicFieldConfigSelect
  | FlDynamicFieldConfigSelectSearch
  | FlDynamicFieldConfigList
  | FlDynamicFieldConfigBoolean
  | FlDynamicFieldConfigTextArea
  | FlDynamicFieldConfigUnknown;

export interface FlDynamicFieldConfigBase extends FlDynamicFormConfigBase {
  controlType: 'formControl';

  type: 'input' | 'select' | 'select-search' | 'list' | 'boolean' | string;

  disabled?: boolean;
  required?: boolean;

  // when true force the field to take full width on the page if included in group
  fullWidth?: boolean;
}

export interface FlDynamicFieldConfigMaterialInput extends FlDynamicFieldConfigBase {
  type: 'input' | 'select' | 'list';

  prefix?: string;
  suffix?: string;
}

export interface FlDynamicFieldConfigInput extends FlDynamicFieldConfigMaterialInput {
  type: 'input';

  inputType: 'text' | 'number';
  // validators (only for numbers)
  min?: number;
  max?: number;
  // if true the number must be an integer
  integer?: boolean;
}

export interface FlDynamicFieldSelectKeyNameOption {
  key: string;
  humanName: string;
}

export type FlDynamicFieldSelectOptions = any[] | FlDynamicFieldSelectKeyNameOption[];

export interface FlDynamicFieldConfigSelect extends FlDynamicFieldConfigMaterialInput {
  type: 'select';

  selectOptions: Signal<FlDynamicFieldSelectOptions>;
}

export interface FlDynamicFieldConfigSelectSearch extends FlDynamicFieldConfigBase {
  type: 'select-search';

  selectOptions: string[];
}

export interface FlDynamicFieldConfigList extends FlDynamicFieldConfigMaterialInput {
  type: 'list';
}

export interface FlDynamicFieldConfigBoolean extends FlDynamicFieldConfigBase {
  type: 'boolean';
}

export interface FlDynamicFieldConfigTextArea extends FlDynamicFieldConfigBase {
  type: 'textarea';
}

// use for additional type configured outside the library
export interface FlDynamicFieldConfigUnknown extends FlDynamicFieldConfigBase {
  type: string;
  // use to pass additional information to the component
  additionalInfo?: any;
}
