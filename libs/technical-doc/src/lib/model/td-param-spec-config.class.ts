import {
  FlDynamicFieldConfig,
  FlDynamicFieldConfigBase,
  FlDynamicFieldConfigBoolean,
  FlDynamicFieldConfigInput,
  FlDynamicFieldConfigList,
  FlDynamicFieldConfigSelect,
  FlDynamicFieldConfigSelectSearch,
  FlDynamicFieldConfigUnknown,
  FlDynamicFormGroupConfig,
} from '@monorepo/front-core-lib';
import {
  tdCodeParamSpecTypeList,
  TdParamSpec,
  TdParamSpecs,
  TdParamSpecSimple,
} from './td-config-spec.class';
import { signal } from '@angular/core';

export class TdParamSpecConfig {
  constructor() {}

  public static convertToFieldConfigs(specs: TdParamSpecs): FlDynamicFormGroupConfig {
    const configs: FlDynamicFormGroupConfig = {
      controlType: 'formGroup',
      subConfigs: {},
    };

    for (const specName of Object.keys(specs)) {
      configs.subConfigs[specName] = TdParamSpecConfig.convertParamSpecToAbstractConfig(
        specs[specName] as TdParamSpecSimple,
        ''
      );
    }

    return configs;
  }

  public static convertToFieldConfigsRecursive(
    specs: Record<string, TdParamSpec | TdParamSpecs>
  ): FlDynamicFormGroupConfig {
    const configs: FlDynamicFormGroupConfig = {
      controlType: 'formGroup',
      subConfigs: {},
    };

    for (const specName of Object.keys(specs)) {
      if (specs[specName] == null) {
        continue;
      }
      if (specName === 'additional_info') {
        configs.subConfigs[specName] = TdParamSpecConfig.convertToFieldConfigs(
          specs[specName] as TdParamSpecs
        );
      } else {
        configs.subConfigs[specName] = TdParamSpecConfig.convertParamSpecToAbstractConfig(
          specs[specName] as TdParamSpecSimple,
          ''
        );
      }
    }
    return configs;
  }

  public static convertParamSpecToAbstractConfig(
    spec: TdParamSpecSimple,
    defaultPlaceholder: string // TODO @vfoex pk avoir besoin de ça ? Le human_name est déjà là
  ): FlDynamicFieldConfig {
    if (spec.additional_info?.allowed_values && spec.additional_info?.allowed_values.length > 0) {
      if (spec.additional_info?.allowed_values.length > 10) {
        const config: FlDynamicFieldConfigSelectSearch = TdParamSpecConfig.convertToBaseFieldConfig(
          spec,
          defaultPlaceholder
        ) as any;
        config.type = 'select-search';
        config.selectOptions = spec.additional_info.allowed_values;
        return config;
      } else {
        const config: FlDynamicFieldConfigSelect = TdParamSpecConfig.convertToBaseFieldConfig(
          spec,
          defaultPlaceholder
        ) as any;
        config.type = 'select';
        config.selectOptions = signal(spec.additional_info.allowed_values);
        config.suffix = spec.unit;
        return config;
      }
    }
    if (spec.type === 'bool') {
      const config: FlDynamicFieldConfigBoolean = TdParamSpecConfig.convertToBaseFieldConfig(
        spec,
        defaultPlaceholder
      ) as any;
      config.type = 'boolean';
      return config;
    } else if (spec.type === 'list') {
      const config: FlDynamicFieldConfigList = TdParamSpecConfig.convertToBaseFieldConfig(
        spec,
        defaultPlaceholder
      ) as any;
      config.type = 'list';
      return config;
    } else if (spec.type === 'text' || spec.type === 'dict') {
      const config: FlDynamicFieldConfig = TdParamSpecConfig.convertToBaseFieldConfig(
        spec,
        defaultPlaceholder
      ) as any;
      config.type = 'textarea';
      config.fullWidth = true;
      return config;
    } else if (spec.type === 'tags_param') {
      const config: FlDynamicFieldConfig = TdParamSpecConfig.convertToBaseFieldConfig(
        spec,
        defaultPlaceholder
      ) as any;
      config.type = 'tags_param';
      return config;
    } else if (spec.type === 'open_ai_chat_param') {
      const config: FlDynamicFieldConfig = TdParamSpecConfig.convertToBaseFieldConfig(
        spec,
        defaultPlaceholder
      ) as any;
      config.type = 'open_ai_chat_param';
      config.fullWidth = true;
      return config;
    } else if (spec.type === 'credentials_param') {
      const config: FlDynamicFieldConfigUnknown = TdParamSpecConfig.convertToBaseFieldConfig(
        spec,
        defaultPlaceholder
      ) as any;
      config.type = 'credentials_param';
      config.additionalInfo = { credentialsType: spec.additional_info.credentials_type };
      return config;
    } else if (spec.type === 'note_template_param') {
      const config: FlDynamicFieldConfigUnknown = TdParamSpecConfig.convertToBaseFieldConfig(
        spec,
        defaultPlaceholder
      ) as any;
      config.type = 'note_template_param';
      return config;
    } else if (spec.type === 'note_param') {
      const config: FlDynamicFieldConfigUnknown = TdParamSpecConfig.convertToBaseFieldConfig(
        spec,
        defaultPlaceholder
      ) as any;
      config.type = 'note_param';
      return config;
    } else if (spec.type === 'scenario_param') {
      const config: FlDynamicFieldConfigUnknown = TdParamSpecConfig.convertToBaseFieldConfig(
        spec,
        defaultPlaceholder
      ) as any;
      config.type = 'scenario_param';
      return config;
    } else if (tdCodeParamSpecTypeList.includes(spec.type)) {
      const config: FlDynamicFieldConfig = TdParamSpecConfig.convertToBaseFieldConfig(
        spec,
        defaultPlaceholder
      ) as any;
      config.type = spec.type;
      config.fullWidth = true;
      return config;
    } else if (spec.type === 'rich_text_param') {
      const config: FlDynamicFieldConfig = TdParamSpecConfig.convertToBaseFieldConfig(
        spec,
        defaultPlaceholder
      ) as any;
      config.type = 'rich_text_param';
      config.fullWidth = true;
      return config;
    } else {
      const config: FlDynamicFieldConfigInput = TdParamSpecConfig.convertToBaseFieldConfig(
        spec,
        defaultPlaceholder
      ) as any;
      config.type = 'input';
      config.inputType = spec.type === 'str' ? 'text' : 'number';
      config.suffix = spec.unit;

      if (spec.type === 'int' || spec.type === 'float') {
        config.min = spec.additional_info.min_value;
        config.max = spec.additional_info.max_value;
        config.integer = spec.type === 'int';
      }
      return config;
    }
  }

  public static convertToBaseFieldConfig(
    spec: TdParamSpec,
    defaultPlaceholder: string
  ): FlDynamicFieldConfigBase {
    return {
      controlType: 'formControl',
      type: null,
      required: !spec.optional,
      placeholder: spec.human_name ?? defaultPlaceholder,
      hint: spec.short_description,
    };
  }
}
