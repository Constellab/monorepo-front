import {
  FlDynamicFieldConfig,
  FlDynamicFieldConfigBase,
  FlDynamicFieldConfigBoolean,
  FlDynamicFieldConfigDate,
  FlDynamicFieldConfigInput,
  FlDynamicFieldConfigList,
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

export class TdParamSpecConfig {
  public static convertParamSpecToAbstractConfig(
    spec: TdParamSpecSimple | TdParamSpecSelect | TdParamSpecBase
  ): FlDynamicFieldConfig {
    if (spec.type === TdParamSpecTypeEnum.SELECT_PARAM) {
      return TdParamSpecConfig.convertSelectParam(spec as TdParamSpecSelect);
    }
    if (spec.type === TdParamSpecTypeEnum.DATE_PARAM) {
      return TdParamSpecConfig.convertDateParam(spec as TdParamSpecDate);
    }
    if (spec.type === TdParamSpecTypeEnum.COMPUTED_PARAM) {
      const config: FlDynamicFieldConfigUnknown = TdParamSpecConfig.convertToBaseFieldConfig(spec) as any;
      config.type = 'computed';
      config.disabled = true;
      config.additionalInfo = {
        expression: spec.additional_info?.expression,
      };
      return config;
    }
    if (spec.additional_info?.allowed_values && spec.additional_info?.allowed_values.length > 0) {
      if (spec.additional_info?.allowed_values.length > 10) {
        const config: FlDynamicFieldConfigSelectSearch = TdParamSpecConfig.convertToBaseFieldConfig(
          spec
        ) as any;
        config.type = 'select-search';
        config.selectOptions = spec.additional_info.allowed_values;
        return config;
      } else {
        const config: FlDynamicFieldConfigSelect = TdParamSpecConfig.convertToBaseFieldConfig(spec) as any;
        config.type = 'select';
        config.selectOptions = spec.additional_info.allowed_values;
        config.suffix = spec.unit;
        return config;
      }
    }
    if (spec.type === TdParamSpecTypeEnum.BOOL) {
      const config: FlDynamicFieldConfigBoolean = TdParamSpecConfig.convertToBaseFieldConfig(spec) as any;
      config.type = 'boolean';
      return config;
    } else if (spec.type === TdParamSpecTypeEnum.LIST) {
      const config: FlDynamicFieldConfigList = TdParamSpecConfig.convertToBaseFieldConfig(spec) as any;
      config.type = 'list';
      return config;
    } else if (spec.type === TdParamSpecTypeEnum.TEXT || spec.type === TdParamSpecTypeEnum.DICT) {
      const config: FlDynamicFieldConfig = TdParamSpecConfig.convertToBaseFieldConfig(spec) as any;
      config.type = 'textarea';
      config.fullWidth = true;
      return config;
    } else if (spec.type === TdParamSpecTypeEnum.TAGS_PARAM) {
      const config: FlDynamicFieldConfig = TdParamSpecConfig.convertToBaseFieldConfig(spec) as any;
      config.type = 'tags_param';
      return config;
    } else if (spec.type === TdParamSpecTypeEnum.OPEN_AI_CHAT_PARAM) {
      const config: FlDynamicFieldConfig = TdParamSpecConfig.convertToBaseFieldConfig(spec) as any;
      config.type = 'open_ai_chat_param';
      config.fullWidth = true;
      return config;
    } else if (spec.type === TdParamSpecTypeEnum.CREDENTIALS_PARAM) {
      const config: FlDynamicFieldConfigUnknown = TdParamSpecConfig.convertToBaseFieldConfig(spec) as any;
      config.type = 'credentials_param';
      config.additionalInfo = { credentialsType: spec.additional_info.credentials_type };
      return config;
    } else if (spec.type === TdParamSpecTypeEnum.LAB_MODEL_PARAM) {
      const config: FlDynamicFieldConfigUnknown = TdParamSpecConfig.convertToBaseFieldConfig(spec) as any;
      config.type = 'lab_model_param';
      return config;
    } else if (spec.type === TdParamSpecTypeEnum.NOTE_TEMPLATE_PARAM) {
      const config: FlDynamicFieldConfigUnknown = TdParamSpecConfig.convertToBaseFieldConfig(spec) as any;
      config.type = 'note_template_param';
      return config;
    } else if (spec.type === TdParamSpecTypeEnum.NOTE_PARAM) {
      const config: FlDynamicFieldConfigUnknown = TdParamSpecConfig.convertToBaseFieldConfig(spec) as any;
      config.type = 'note_param';
      return config;
    } else if (spec.type === TdParamSpecTypeEnum.SCENARIO_PARAM) {
      const config: FlDynamicFieldConfigUnknown = TdParamSpecConfig.convertToBaseFieldConfig(spec) as any;
      config.type = 'scenario_param';
      return config;
    } else if (spec.type === TdParamSpecTypeEnum.SPACE_FOLDER_PARAM) {
      const config: FlDynamicFieldConfigUnknown = TdParamSpecConfig.convertToBaseFieldConfig(spec) as any;
      config.type = 'space_folder_param';
      return config;
    } else if (TD_CODE_PARAM_SPEC_TYPE_LIST.includes(spec.type)) {
      const config: FlDynamicFieldConfig = TdParamSpecConfig.convertToBaseFieldConfig(spec) as any;
      config.type = spec.type;
      config.fullWidth = true;
      return config;
    } else if (spec.type === TdParamSpecTypeEnum.RICH_TEXT_PARAM) {
      const config: FlDynamicFieldConfig = TdParamSpecConfig.convertToBaseFieldConfig(spec) as any;
      config.type = 'rich_text_param';
      config.fullWidth = true;
      return config;
    } else if (spec.type === TdParamSpecTypeEnum.STR) {
      const config: FlDynamicFieldConfigInput = TdParamSpecConfig.convertToBaseFieldConfig(spec) as any;
      config.type = 'input';
      config.inputType = 'text';
      config.suffix = spec.unit;
      config.minLength = spec.additional_info.min_length;
      config.maxLength = spec.additional_info.max_length;
      return config;
    } else if (spec.type === TdParamSpecTypeEnum.INT || spec.type === TdParamSpecTypeEnum.FLOAT) {
      const config: FlDynamicFieldConfigInput = TdParamSpecConfig.convertToBaseFieldConfig(spec) as any;
      config.type = 'input';
      config.inputType = 'number';
      config.suffix = spec.unit;
      config.min = spec.additional_info.min_value;
      config.max = spec.additional_info.max_value;
      config.integer = spec.type === TdParamSpecTypeEnum.INT;
      return config;
    } else {
      // raise error for unknown type
      throw new Error('Unknown param spec type: ' + spec.type);
    }
  }

  private static convertSelectParam(spec: TdParamSpecSelect): FlDynamicFieldConfig {
    const options = (spec.additional_info?.options ?? [])
      .filter((opt) => opt.value != null && String(opt.value).length > 0)
      .map((opt) => ({ key: String(opt.value), humanName: opt.label || String(opt.value) }));
    const base = TdParamSpecConfig.convertToBaseFieldConfig(spec);
    const noneOption: { key: string; humanName: string } = { key: null, humanName: '—' };

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

  public static convertToBaseFieldConfig(spec: TdParamSpec | TdParamSpecBase): FlDynamicFieldConfigBase {
    return {
      controlType: 'formControl',
      type: null,
      required: !spec.optional,
      placeholder: spec.human_name,
      hint: spec.short_description,
    };
  }
}
