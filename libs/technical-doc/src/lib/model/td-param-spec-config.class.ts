import {
  FlDynamicFieldConfig,
  FlDynamicFieldConfigBase,
  FlDynamicFieldConfigDate,
  FlDynamicFieldConfigInput,
  FlDynamicFieldConfigSelect,
  FlDynamicFieldConfigSelectSearch,
  FlDynamicFieldConfigUnknown,
} from '@monorepo/front-core-lib/fl-dynamic-field';

import {
  TD_CODE_PARAM_SPEC_TYPE_LIST,
  TdParamSpec,
  TdParamSpecBase,
  TdParamSpecDate,
  TdParamSpecSelect,
  TdParamSpecSimple,
  TdParamSpecTypeEnum,
} from './td-config-spec.class';

/**
 * All the param spec shapes that can be converted to a dynamic field config.
 */
type TdConvertibleParamSpec = TdParamSpecSimple | TdParamSpecSelect | TdParamSpecBase;

/**
 * Field config of the param spec types that only need a field type (and optionally the full width flag).
 */
interface TdSimpleFieldConfig {
  type: string;
  fullWidth?: boolean;
}

export class TdParamSpecConfig {
  private static readonly SIMPLE_FIELD_CONFIGS: Partial<Record<TdParamSpecTypeEnum, TdSimpleFieldConfig>> = {
    [TdParamSpecTypeEnum.BOOL]: { type: 'boolean' },
    [TdParamSpecTypeEnum.LIST]: { type: 'list' },
    [TdParamSpecTypeEnum.TEXT]: { type: 'textarea', fullWidth: true },
    [TdParamSpecTypeEnum.DICT]: { type: 'textarea', fullWidth: true },
    [TdParamSpecTypeEnum.TAGS_PARAM]: { type: 'tags_param' },
    [TdParamSpecTypeEnum.OPEN_AI_CHAT_PARAM]: { type: 'open_ai_chat_param', fullWidth: true },
    [TdParamSpecTypeEnum.LAB_MODEL_PARAM]: { type: 'lab_model_param' },
    [TdParamSpecTypeEnum.NOTE_TEMPLATE_PARAM]: { type: 'note_template_param' },
    [TdParamSpecTypeEnum.NOTE_PARAM]: { type: 'note_param' },
    [TdParamSpecTypeEnum.SCENARIO_PARAM]: { type: 'scenario_param' },
    [TdParamSpecTypeEnum.SPACE_FOLDER_PARAM]: { type: 'space_folder_param' },
    [TdParamSpecTypeEnum.RICH_TEXT_PARAM]: { type: 'rich_text_param', fullWidth: true },
  };

  public static convertParamSpecToAbstractConfig(spec: TdConvertibleParamSpec): FlDynamicFieldConfig {
    switch (spec.type) {
      case TdParamSpecTypeEnum.SELECT_PARAM:
        return TdParamSpecConfig.convertSelectParam(spec as TdParamSpecSelect);
      case TdParamSpecTypeEnum.DATE_PARAM:
        return TdParamSpecConfig.convertDateParam(spec as TdParamSpecDate);
      case TdParamSpecTypeEnum.COMPUTED_PARAM:
        return TdParamSpecConfig.convertComputedParam(spec);
    }

    // whatever the type, a spec with allowed values is displayed as a select
    const allowedValues = spec.additional_info?.allowed_values;
    if (allowedValues && allowedValues.length > 0) {
      return TdParamSpecConfig.convertAllowedValuesParam(spec, allowedValues);
    }

    return TdParamSpecConfig.convertParamByType(spec);
  }

  private static convertComputedParam(spec: TdConvertibleParamSpec): FlDynamicFieldConfig {
    const config: FlDynamicFieldConfigUnknown = TdParamSpecConfig.convertToBaseFieldConfig(spec) as any;
    config.type = 'computed';
    config.disabled = true;
    config.additionalInfo = {
      expression: spec.additional_info?.expression,
    };
    return config;
  }

  private static convertAllowedValuesParam(
    spec: TdConvertibleParamSpec,
    allowedValues: any[]
  ): FlDynamicFieldConfig {
    if (allowedValues.length > 10) {
      const config: FlDynamicFieldConfigSelectSearch = TdParamSpecConfig.convertToBaseFieldConfig(
        spec
      ) as any;
      config.type = 'select-search';
      config.selectOptions = allowedValues;
      return config;
    }

    const config: FlDynamicFieldConfigSelect = TdParamSpecConfig.convertToBaseFieldConfig(spec) as any;
    config.type = 'select';
    config.selectOptions = allowedValues;
    config.suffix = spec.unit;
    return config;
  }

  /**
   * Build the field config from the param spec type only (for the types without allowed values).
   */
  private static convertParamByType(spec: TdConvertibleParamSpec): FlDynamicFieldConfig {
    switch (spec.type) {
      case TdParamSpecTypeEnum.CREDENTIALS_PARAM:
        return TdParamSpecConfig.convertCredentialsParam(spec);
      case TdParamSpecTypeEnum.STR:
        return TdParamSpecConfig.convertStrParam(spec);
      case TdParamSpecTypeEnum.INT:
      case TdParamSpecTypeEnum.FLOAT:
        return TdParamSpecConfig.convertNumberParam(spec);
    }

    if (TD_CODE_PARAM_SPEC_TYPE_LIST.includes(spec.type)) {
      const config: FlDynamicFieldConfig = TdParamSpecConfig.convertToBaseFieldConfig(spec) as any;
      config.type = spec.type;
      config.fullWidth = true;
      return config;
    }

    const simpleConfig = TdParamSpecConfig.SIMPLE_FIELD_CONFIGS[spec.type];
    if (!simpleConfig) {
      // raise error for unknown type
      throw new Error('Unknown param spec type: ' + spec.type);
    }

    const config: FlDynamicFieldConfig = TdParamSpecConfig.convertToBaseFieldConfig(spec) as any;
    config.type = simpleConfig.type;
    if (simpleConfig.fullWidth) {
      config.fullWidth = true;
    }
    return config;
  }

  private static convertCredentialsParam(spec: TdConvertibleParamSpec): FlDynamicFieldConfig {
    const config: FlDynamicFieldConfigUnknown = TdParamSpecConfig.convertToBaseFieldConfig(spec) as any;
    config.type = 'credentials_param';
    config.additionalInfo = { credentialsType: spec.additional_info.credentials_type };
    return config;
  }

  private static convertStrParam(spec: TdConvertibleParamSpec): FlDynamicFieldConfig {
    const config: FlDynamicFieldConfigInput = TdParamSpecConfig.convertToBaseFieldConfig(spec) as any;
    config.type = 'input';
    config.inputType = 'text';
    config.suffix = spec.unit;
    config.minLength = spec.additional_info.min_length;
    config.maxLength = spec.additional_info.max_length;
    config.regex = spec.additional_info.regex;
    config.regexDescription = spec.additional_info.regex_description;
    return config;
  }

  private static convertNumberParam(spec: TdConvertibleParamSpec): FlDynamicFieldConfig {
    const config: FlDynamicFieldConfigInput = TdParamSpecConfig.convertToBaseFieldConfig(spec) as any;
    config.type = 'input';
    config.inputType = 'number';
    config.suffix = spec.unit;
    config.min = spec.additional_info.min_value;
    config.max = spec.additional_info.max_value;
    config.integer = spec.type === TdParamSpecTypeEnum.INT;
    return config;
  }

  private static convertSelectParam(spec: TdParamSpecSelect): FlDynamicFieldConfig {
    const options = (spec.additional_info?.options ?? [])
      .filter((opt) => opt.value != null && String(opt.value).length > 0)
      .map((opt) => ({ key: String(opt.value), humanName: opt.label || String(opt.value) }));
    const base = TdParamSpecConfig.convertToBaseFieldConfig(spec);
    const noneOption: { key: string | null; humanName: string } = { key: null, humanName: '—' };

    const isMultiple = !!spec.additional_info?.multiple;
    // if there are more than 10 options and it's not multiple, use select-search
    if (options.length > 10 && !isMultiple) {
      const config: FlDynamicFieldConfigSelectSearch = base as any;
      config.type = 'select-search';
      config.selectOptions = options.map((o) => o.key);
      return config;
    }

    const config: FlDynamicFieldConfigSelect = base as any;
    config.type = 'select';
    config.multiple = isMultiple;
    config.selectOptions = isMultiple ? options : [noneOption, ...options];
    return config;
  }

  private static convertDateParam(spec: TdParamSpecDate): FlDynamicFieldConfig {
    const config: FlDynamicFieldConfigDate = TdParamSpecConfig.convertToBaseFieldConfig(spec) as any;
    config.type = 'date';
    config.includeTime = !!spec.additional_info?.include_time;
    config.minValue = spec.additional_info?.min_value ?? null;
    config.maxValue = spec.additional_info?.max_value ?? null;
    return config;
  }

  public static convertToBaseFieldConfig(
    spec: TdParamSpec | TdParamSpecBase
  ): Omit<FlDynamicFieldConfigBase, 'type'> & { type: string | null } {
    return {
      controlType: 'formControl',
      type: null,
      required: !spec.optional,
      placeholder: spec.human_name,
      hint: spec.short_description,
    };
  }
}
