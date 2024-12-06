export interface TdConfig {
  specs: TdParamSpecs;
  values: Record<string, any>;
}

/**
 * Define the type of the param spec
 */
export type TdParamSpecType =
  | 'str'
  | 'text'
  | 'rich_text_param'
  | 'int'
  | 'float'
  | 'list'
  | 'bool'
  | 'param_set'
  | 'tags_param'
  | 'python_code_param'
  | 'r_code_param'
  | 'julia_code_param'
  | 'bash_code_param'
  | 'perl_code_param'
  | 'yaml_code_param'
  | 'json_code_param'
  | 'open_ai_chat_param'
  | 'credentials_param'
  | 'note_template_param'
  | 'note_param'
  | 'scenario_param'
  | 'dynamic'
  | 'dict';

/**
 * Visibility of the param spec
 * - public: basic param
 * - protected: advanced param
 */
export type TdParamSpecVisibility = 'protected' | 'public' | 'private';

/**
 * Common base for all param spec
 */
export interface TdParamSpecBase {
  /**
   * Type of the param value (string, float...)
   */
  type: TdParamSpecType;

  /**
   * If false the param if mandatory
   */
  optional: boolean;

  /**
   * Default value
   */
  default_value?: any;

  /**
   * Measure unit of the value (ex km)
   */
  unit?: string;

  /**
   * Human-readable name for the param
   */
  human_name?: string;

  /**
   * Short description for the param
   */
  short_description?: string;

  /**
   * Visibility for the param, if protected, it is considered as advanced option
   */
  visibility: TdParamSpecVisibility;

  // allowed_values?: any;

  /**
   * Custom properties depending on the type of the param
   */
  additional_info: any;
}

/**
 * All param set spec type including param set spec
 */
export type TdParamSpec = TdParamSpecSimple | TdParamSpecParamSet | TdParamSpecDynamic;

export type TdParamSpecs = Record<string, TdParamSpec>;
/**
 * Basic param spec (excluding param set)
 */
export type TdParamSpecSimple =
  | TdParamSpecString
  | TdParamSpecText
  | TdParamSpecFloat
  | TdParamSelectCredentials
  | TdParamSpecBasic;

/**
 * Param for short string
 */
export interface TdParamSpecString extends TdParamSpecBase {
  type: 'str';

  additional_info: {
    min_length?: number;
    max_length?: number;
    allowed_values?: string[];
  };
}

/**
 * Param for long text
 */
export interface TdParamSpecText extends TdParamSpecBase {
  type: 'text' | 'dict';
}

export interface TdParamSpecFloat extends TdParamSpecBase {
  type: 'int' | 'float';

  additional_info: {
    min_value?: number;
    max_value?: number;
    allowed_values?: number[];
  };
}

// list of params spec that does not have additional info
interface TdParamSpecBasic extends TdParamSpecBase {
  type:
    | 'bool'
    | 'list'
    | 'tags_param'
    | 'open_ai_chat_param'
    | 'python_code_param'
    | 'r_code_param'
    | 'julia_code_param'
    | 'bash_code_param'
    | 'perl_code_param'
    | 'yaml_code_param'
    | 'json_code_param'
    | 'note_template_param'
    | 'note_param'
    | 'scenario_param'
    | 'rich_text_param';
}

export interface TdParamSelectCredentials extends TdParamSpecBase {
  type: 'credentials_param';

  additional_info: {
    credentials_type: string;
  };
}

/**
 * Special param spec that contains sub params
 */
export interface TdParamSpecParamSet extends TdParamSpecBase {
  type: 'param_set';

  additional_info: {
    param_set: TdParamSpecs;
    max_number_of_occurrences: number;
  };
}

/**
 * Special param spec that contains dynamic sub params
 */
export interface TdParamSpecDynamic extends TdParamSpecBase {
  type: 'dynamic';

  additional_info: {
    specs: TdParamSpecs;
  };
}

// list of param spec type that uses a code editor
export const tdCodeParamSpecTypeList: TdParamSpecType[] = [
  'python_code_param',
  'r_code_param',
  'julia_code_param',
  'bash_code_param',
  'perl_code_param',
  'yaml_code_param',
  'json_code_param',
];


export type TdParamSpecFormInfoList =
  Record<string, Record<string, TdParamSpec | TdParamSpecs>>;

export interface TdParamSpecsValues {
  specs: TdParamSpecs;
  values: Record<string, any>;
}
