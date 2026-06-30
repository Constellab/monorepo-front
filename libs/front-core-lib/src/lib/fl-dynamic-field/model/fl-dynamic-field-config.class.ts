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
  | FlDynamicFieldConfigDate
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
  // validators for numbers
  min?: number;
  max?: number;
  integer?: boolean;
  // validators for text
  minLength?: number;
  maxLength?: number;
  regex?: string;
  // optional human-readable explanation of the regex,
  // shown as the error message when the value does not match
  regexDescription?: string;
}

export interface FlDynamicFieldSelectKeyNameOption {
  key: string;
  humanName: string;
  group?: string; // optional group name for the option
}

export type FlDynamicFieldSelectOptions = any[] | FlDynamicFieldSelectKeyNameOption[];

export interface FlDynamicFieldConfigSelect extends FlDynamicFieldConfigMaterialInput {
  type: 'select';

  selectOptions: FlDynamicFieldSelectOptions;
  multiple?: boolean;
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

export interface FlDynamicFieldConfigDate extends FlDynamicFieldConfigBase {
  type: 'date';

  /** When true, show date + time picker; when false, date only */
  includeTime: boolean;
  /** Minimum allowed value as ISO 8601 string */
  minValue?: string | null;
  /** Maximum allowed value as ISO 8601 string */
  maxValue?: string | null;
}

// use for additional type configured outside the library
export interface FlDynamicFieldConfigUnknown extends FlDynamicFieldConfigBase {
  type: string;
  // use to pass additional information to the component
  additionalInfo?: any;
}
