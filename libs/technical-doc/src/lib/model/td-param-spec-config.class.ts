import {
  FlDynamicFieldConfig,
  FlDynamicFieldConfigBase,
  FlDynamicFieldConfigBoolean,
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
  TdParamSpecSelect,
  TdParamSpecSimple,
} from './td-config-spec.class';

export class TdParamSpecConfig {
  public static convertParamSpecToAbstractConfig(
    spec: TdParamSpecSimple | TdParamSpecSelect | TdParamSpecBase
  ): FlDynamicFieldConfig {
    if (spec.type === 'select_param') {
      return TdParamSpecConfig.convertSelectParam(spec as TdParamSpecSelect);
    }
    if (spec.type === 'computed_param') {
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
    if (spec.type === 'bool') {
      const config: FlDynamicFieldConfigBoolean = TdParamSpecConfig.convertToBaseFieldConfig(spec) as any;
      config.type = 'boolean';
      return config;
    } else if (spec.type === 'list') {
      const config: FlDynamicFieldConfigList = TdParamSpecConfig.convertToBaseFieldConfig(spec) as any;
      config.type = 'list';
      return config;
    } else if (spec.type === 'text' || spec.type === 'dict') {
      const config: FlDynamicFieldConfig = TdParamSpecConfig.convertToBaseFieldConfig(spec) as any;
      config.type = 'textarea';
      config.fullWidth = true;
      return config;
    } else if (spec.type === 'tags_param') {
      const config: FlDynamicFieldConfig = TdParamSpecConfig.convertToBaseFieldConfig(spec) as any;
      config.type = 'tags_param';
      return config;
    } else if (spec.type === 'open_ai_chat_param') {
      const config: FlDynamicFieldConfig = TdParamSpecConfig.convertToBaseFieldConfig(spec) as any;
      config.type = 'open_ai_chat_param';
      config.fullWidth = true;
      return config;
    } else if (spec.type === 'credentials_param') {
      const config: FlDynamicFieldConfigUnknown = TdParamSpecConfig.convertToBaseFieldConfig(spec) as any;
      config.type = 'credentials_param';
      config.additionalInfo = { credentialsType: spec.additional_info.credentials_type };
      return config;
    } else if (spec.type === 'lab_model_param') {
      const config: FlDynamicFieldConfigUnknown = TdParamSpecConfig.convertToBaseFieldConfig(spec) as any;
      config.type = 'lab_model_param';
      return config;
    } else if (spec.type === 'note_template_param') {
      const config: FlDynamicFieldConfigUnknown = TdParamSpecConfig.convertToBaseFieldConfig(spec) as any;
      config.type = 'note_template_param';
      return config;
    } else if (spec.type === 'note_param') {
      const config: FlDynamicFieldConfigUnknown = TdParamSpecConfig.convertToBaseFieldConfig(spec) as any;
      config.type = 'note_param';
      return config;
    } else if (spec.type === 'scenario_param') {
      const config: FlDynamicFieldConfigUnknown = TdParamSpecConfig.convertToBaseFieldConfig(spec) as any;
      config.type = 'scenario_param';
      return config;
    } else if (spec.type === 'space_folder_param') {
      const config: FlDynamicFieldConfigUnknown = TdParamSpecConfig.convertToBaseFieldConfig(spec) as any;
      config.type = 'space_folder_param';
      return config;
    } else if (TD_CODE_PARAM_SPEC_TYPE_LIST.includes(spec.type)) {
      const config: FlDynamicFieldConfig = TdParamSpecConfig.convertToBaseFieldConfig(spec) as any;
      config.type = spec.type;
      config.fullWidth = true;
      return config;
    } else if (spec.type === 'rich_text_param') {
      const config: FlDynamicFieldConfig = TdParamSpecConfig.convertToBaseFieldConfig(spec) as any;
      config.type = 'rich_text_param';
      config.fullWidth = true;
      return config;
    } else if (spec.type === 'str') {
      const config: FlDynamicFieldConfigInput = TdParamSpecConfig.convertToBaseFieldConfig(spec) as any;
      config.type = 'input';
      config.inputType = 'text';
      config.suffix = spec.unit;
      config.minLength = spec.additional_info.min_length;
      config.maxLength = spec.additional_info.max_length;
      return config;
    } else if (spec.type === 'int' || spec.type === 'float') {
      const config: FlDynamicFieldConfigInput = TdParamSpecConfig.convertToBaseFieldConfig(spec) as any;
      config.type = 'input';
      config.inputType = 'number';
      config.suffix = spec.unit;
      config.min = spec.additional_info.min_value;
      config.max = spec.additional_info.max_value;
      config.integer = spec.type === 'int';
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
