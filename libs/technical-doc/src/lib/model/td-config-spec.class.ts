export enum TdParamSpecTypeEnum {
  STR = 'str',
  TEXT = 'text',
  BOOL = 'bool',
  INT = 'int',
  FLOAT = 'float',
  LIST = 'list',
  DICT = 'dict',
  DYNAMIC = 'dynamic',
  JSON_CODE_PARAM = 'json_code_param',
  RICH_TEXT_PARAM = 'rich_text_param',
  OPEN_AI_CHAT_PARAM = 'open_ai_chat_param',
  TAGS_PARAM = 'tags_param',
  PYTHON_CODE_PARAM = 'python_code_param',
  BASH_CODE_PARAM = 'bash_code_param',
  JULIA_CODE_PARAM = 'julia_code_param',
  PERL_CODE_PARAM = 'perl_code_param',
  R_CODE_PARAM = 'r_code_param',
  YAML_CODE_PARAM = 'yaml_code_param',
  CREDENTIALS_PARAM = 'credentials_param',
  SPACE_FOLDER_PARAM = 'space_folder_param',
  LAB_MODEL_PARAM = 'lab_model_param',
  NOTE_PARAM = 'note_param',
  NOTE_TEMPLATE_PARAM = 'note_template_param',
  SCENARIO_PARAM = 'scenario_param',
  COMPUTED_PARAM = 'computed_param',
  PARAM_SET = 'param_set',
  SELECT_PARAM = 'select_param',
  DATE_PARAM = 'date_param',
}

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
  type: TdParamSpecTypeEnum;

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

  /**
   * Custom properties depending on the type of the param
   */
  additional_info: any;
}

/**
 * All param set spec type including param set spec
 */
export type TdParamSpec =
  | TdParamSpecSimple
  | TdParamSpecParamSet
  | TdParamSpecDynamic
  | TdParamSpecComputed
  | TdParamSpecSelect
  | TdParamSpecDate;

export type TdParamSpecs = Record<string, TdParamSpec>;
/**
 * Basic param spec (excluding param set)
 */
export type TdParamSpecSimple =
  | TdParamSpecString
  | TdParamSpecText
  | TdParamSpecFloat
  | TdParamSelectCredentials
  | TdParamSpecBasic
  | TdParamSpecDate;

/**
 * Param for short string
 */
export interface TdParamSpecString extends TdParamSpecBase {
  type: TdParamSpecTypeEnum.STR;

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
  type: TdParamSpecTypeEnum.TEXT | TdParamSpecTypeEnum.DICT;
}

export interface TdParamSpecFloat extends TdParamSpecBase {
  type: TdParamSpecTypeEnum.INT | TdParamSpecTypeEnum.FLOAT;

  additional_info: {
    min_value?: number;
    max_value?: number;
    allowed_values?: number[];
  };
}

// list of params spec that does not have additional info
interface TdParamSpecBasic extends TdParamSpecBase {
  type:
    | TdParamSpecTypeEnum.BOOL
    | TdParamSpecTypeEnum.LIST
    | TdParamSpecTypeEnum.TAGS_PARAM
    | TdParamSpecTypeEnum.OPEN_AI_CHAT_PARAM
    | TdParamSpecTypeEnum.PYTHON_CODE_PARAM
    | TdParamSpecTypeEnum.R_CODE_PARAM
    | TdParamSpecTypeEnum.JULIA_CODE_PARAM
    | TdParamSpecTypeEnum.BASH_CODE_PARAM
    | TdParamSpecTypeEnum.PERL_CODE_PARAM
    | TdParamSpecTypeEnum.YAML_CODE_PARAM
    | TdParamSpecTypeEnum.JSON_CODE_PARAM
    | TdParamSpecTypeEnum.NOTE_TEMPLATE_PARAM
    | TdParamSpecTypeEnum.NOTE_PARAM
    | TdParamSpecTypeEnum.SCENARIO_PARAM
    | TdParamSpecTypeEnum.SPACE_FOLDER_PARAM
    | TdParamSpecTypeEnum.RICH_TEXT_PARAM
    | TdParamSpecTypeEnum.LAB_MODEL_PARAM;
}

export interface TdParamSelectCredentials extends TdParamSpecBase {
  type: TdParamSpecTypeEnum.CREDENTIALS_PARAM;

  additional_info: {
    credentials_type: string;
  };
}

/**
 * Special param spec that contains sub params
 */
export interface TdParamSpecParamSet extends TdParamSpecBase {
  type: TdParamSpecTypeEnum.PARAM_SET;

  additional_info: {
    param_set: TdParamSpecs;
    max_number_of_occurrences: number;
  };
}

/**
 * Special param spec that contains dynamic sub params
 */
export interface TdParamSpecDynamic extends TdParamSpecBase {
  type: TdParamSpecTypeEnum.DYNAMIC;

  additional_info: {
    specs: TdParamSpecs;
    edition_mode: boolean;
  };
}

export interface TdParamSpecComputed extends TdParamSpecBase {
  type: TdParamSpecTypeEnum.COMPUTED_PARAM;

  additional_info: any;
}

/**
 * Runtime value wrapper for computed param fields.
 * Computed cells in form values are stored as {value, errors}.
 */
export interface TdComputedParamValue {
  value: unknown;
  errors: string;
}

export interface TdSelectParamOption {
  label: string;
  value: string | number | boolean | null;
}

export interface TdParamSpecDate extends TdParamSpecBase {
  type: TdParamSpecTypeEnum.DATE_PARAM;

  additional_info: {
    include_time: boolean;
    min_value: string | null;
    max_value: string | null;
  };
}

export interface TdParamSpecSelect extends TdParamSpecBase {
  type: TdParamSpecTypeEnum.SELECT_PARAM;

  default_value: TdSelectParamOption['value'] | TdSelectParamOption['value'][] | null;

  additional_info: {
    options: TdSelectParamOption[];
    multiple: boolean;
  };
}

export type TdParamSpecsValues = Record<string, any>;

export interface TdParamSpecEntry {
  key: string;
  spec: TdParamSpec;
}

export enum TdParamSpecCategory {
  SIMPLE = 'simple',
  CODE = 'code',
  LAB_SPECIFIC = 'lab_specific',
  OTHER = 'other',
}

export interface TdParamSpecInfo {
  type: TdParamSpecTypeEnum;
  category: TdParamSpecCategory;
}

export const TD_PARAM_SPEC_INFO_LIST: TdParamSpecInfo[] = [
  // Simple types
  { type: TdParamSpecTypeEnum.STR, category: TdParamSpecCategory.SIMPLE },
  { type: TdParamSpecTypeEnum.TEXT, category: TdParamSpecCategory.SIMPLE },
  { type: TdParamSpecTypeEnum.BOOL, category: TdParamSpecCategory.SIMPLE },
  { type: TdParamSpecTypeEnum.INT, category: TdParamSpecCategory.SIMPLE },
  { type: TdParamSpecTypeEnum.FLOAT, category: TdParamSpecCategory.SIMPLE },
  { type: TdParamSpecTypeEnum.SELECT_PARAM, category: TdParamSpecCategory.SIMPLE },
  { type: TdParamSpecTypeEnum.DATE_PARAM, category: TdParamSpecCategory.SIMPLE },

  // Code params
  { type: TdParamSpecTypeEnum.JSON_CODE_PARAM, category: TdParamSpecCategory.CODE },
  { type: TdParamSpecTypeEnum.PYTHON_CODE_PARAM, category: TdParamSpecCategory.CODE },
  { type: TdParamSpecTypeEnum.BASH_CODE_PARAM, category: TdParamSpecCategory.CODE },
  { type: TdParamSpecTypeEnum.JULIA_CODE_PARAM, category: TdParamSpecCategory.CODE },
  { type: TdParamSpecTypeEnum.PERL_CODE_PARAM, category: TdParamSpecCategory.CODE },
  { type: TdParamSpecTypeEnum.R_CODE_PARAM, category: TdParamSpecCategory.CODE },
  { type: TdParamSpecTypeEnum.YAML_CODE_PARAM, category: TdParamSpecCategory.CODE },

  // Lab-specific types
  // { type: TdParamSpecTypeEnum.OPEN_AI_CHAT_PARAM, category: TdParamSpecCategory.LAB_SPECIFIC },
  { type: TdParamSpecTypeEnum.TAGS_PARAM, category: TdParamSpecCategory.LAB_SPECIFIC },
  { type: TdParamSpecTypeEnum.CREDENTIALS_PARAM, category: TdParamSpecCategory.LAB_SPECIFIC },
  { type: TdParamSpecTypeEnum.SPACE_FOLDER_PARAM, category: TdParamSpecCategory.LAB_SPECIFIC },
  { type: TdParamSpecTypeEnum.LAB_MODEL_PARAM, category: TdParamSpecCategory.LAB_SPECIFIC },
  { type: TdParamSpecTypeEnum.NOTE_PARAM, category: TdParamSpecCategory.LAB_SPECIFIC },
  { type: TdParamSpecTypeEnum.NOTE_TEMPLATE_PARAM, category: TdParamSpecCategory.LAB_SPECIFIC },
  { type: TdParamSpecTypeEnum.SCENARIO_PARAM, category: TdParamSpecCategory.LAB_SPECIFIC },

  // Other types
  { type: TdParamSpecTypeEnum.RICH_TEXT_PARAM, category: TdParamSpecCategory.OTHER },
  { type: TdParamSpecTypeEnum.COMPUTED_PARAM, category: TdParamSpecCategory.OTHER },
  { type: TdParamSpecTypeEnum.PARAM_SET, category: TdParamSpecCategory.OTHER },
];

export function tdGetParamSpecInfo(categories: TdParamSpecCategory[]): TdParamSpecInfo[] {
  return TD_PARAM_SPEC_INFO_LIST.filter((info) => categories.includes(info.category));
}

export interface TdGroupedParamSpecTypes {
  category: TdParamSpecCategory;
  types: TdParamSpecTypeEnum[];
}

/**
 * Group param spec types by category for easier display in the UI
 */
export function tdBuildGroupedTypes(list: TdParamSpecInfo[]): TdGroupedParamSpecTypes[] {
  const groupMap = new Map<TdParamSpecCategory, TdParamSpecTypeEnum[]>();
  for (const info of list) {
    if (!groupMap.has(info.category)) {
      groupMap.set(info.category, []);
    }
    groupMap.get(info.category).push(info.type);
  }
  return Array.from(groupMap.entries()).map(([category, types]) => ({
    category,
    types,
  }));
}

// list of param spec type that uses a code editor
export const TD_CODE_PARAM_SPEC_TYPE_LIST: TdParamSpecTypeEnum[] = [
  TdParamSpecTypeEnum.PYTHON_CODE_PARAM,
  TdParamSpecTypeEnum.R_CODE_PARAM,
  TdParamSpecTypeEnum.JULIA_CODE_PARAM,
  TdParamSpecTypeEnum.BASH_CODE_PARAM,
  TdParamSpecTypeEnum.PERL_CODE_PARAM,
  TdParamSpecTypeEnum.YAML_CODE_PARAM,
  TdParamSpecTypeEnum.JSON_CODE_PARAM,
];

export interface TdValidateComputedParamResult {
  valid: boolean;
  referenced_keys: string[];
  error: string | null;
}

export const TD_TYPES_WITHOUT_DEFAULT_VALUE: TdParamSpecTypeEnum[] = [
  TdParamSpecTypeEnum.PARAM_SET,
  TdParamSpecTypeEnum.COMPUTED_PARAM,
  TdParamSpecTypeEnum.RICH_TEXT_PARAM,
  TdParamSpecTypeEnum.OPEN_AI_CHAT_PARAM,
  TdParamSpecTypeEnum.TAGS_PARAM,
  ...TD_CODE_PARAM_SPEC_TYPE_LIST,
  TdParamSpecTypeEnum.CREDENTIALS_PARAM,
  TdParamSpecTypeEnum.SPACE_FOLDER_PARAM,
  TdParamSpecTypeEnum.LAB_MODEL_PARAM,
  TdParamSpecTypeEnum.NOTE_PARAM,
  TdParamSpecTypeEnum.NOTE_TEMPLATE_PARAM,
  TdParamSpecTypeEnum.SCENARIO_PARAM,
];
