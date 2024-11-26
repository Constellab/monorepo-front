import {
  FlDynamicFieldConfig,
  FlDynamicFieldConfigBase,
  FlDynamicFieldConfigBoolean,
  FlDynamicFieldConfigInput,
  FlDynamicFieldConfigList,
  FlDynamicFieldConfigSelect,
  FlDynamicFormGroupConfig,
  FlTranslateService,
} from '@monorepo/front-core-lib';
import {
  tdCodeParamSpecTypeList,
  TdParamSpecFormInfo,
  TdParamSpecFormInfoList,
  TdParamSpecType,
} from './td-config-spec.class';

export class TdParamSpecConfig {
  infoList: TdParamSpecFormInfoList;

  constructor(
    infoList: TdParamSpecFormInfoList,
    private translateService: FlTranslateService
  ) {
    this.infoList = infoList;
  }

  public getDynamicFormFieldsConfig(type: TdParamSpecType): FlDynamicFormGroupConfig {
    const typeParamFormInfo = this.infoList[type];
    if (!typeParamFormInfo) {
      return null;
    }
    return this.convertToFieldConfigs(typeParamFormInfo);
  }

  private convertToFieldConfigs(
    typeParamFormInfo: Record<string, TdParamSpecFormInfo | Record<string, TdParamSpecFormInfo>>
  ): FlDynamicFormGroupConfig {
    const configs: FlDynamicFormGroupConfig = {
      controlType: 'formGroup',
      subConfigs: {},
    };

    for (const paramSpecInfoKey in typeParamFormInfo) {
      const paramSpecInfoAttribute = typeParamFormInfo[paramSpecInfoKey];
      if ((paramSpecInfoAttribute as TdParamSpecFormInfo).type) {
        configs.subConfigs[paramSpecInfoKey] = this.convertToAbstractConfig(
          paramSpecInfoKey,
          paramSpecInfoAttribute as TdParamSpecFormInfo
        );
        continue;
      }
      if (Object.keys(paramSpecInfoAttribute as Record<string, TdParamSpecFormInfo>).length > 0) {
        configs.subConfigs[paramSpecInfoKey] = this.convertToFieldConfigs(
          paramSpecInfoAttribute as Record<string, TdParamSpecFormInfo | Record<string, TdParamSpecFormInfo>>
        );
      }
    }

    return configs;
  }

  private convertToAbstractConfig(name: string, specFormInfo: TdParamSpecFormInfo): FlDynamicFieldConfig {
    if (specFormInfo.value && specFormInfo.type === 'list') {
      const config: FlDynamicFieldConfigSelect = this.convertToBaseFieldConfig(name, specFormInfo) as any;
      config.type = 'select';
      config.selectOptions = specFormInfo.value;
      return config;
    }
    if (specFormInfo.type === 'bool') {
      const config: FlDynamicFieldConfigBoolean = this.convertToBaseFieldConfig(name, specFormInfo) as any;
      config.type = 'boolean';
      return config;
    } else if (specFormInfo.type === 'list') {
      const config: FlDynamicFieldConfigList = this.convertToBaseFieldConfig(name, specFormInfo) as any;
      config.type = 'list';
      return config;
    } else if (specFormInfo.type === 'text' || specFormInfo.type === 'dict') {
      const config: FlDynamicFieldConfig = this.convertToBaseFieldConfig(name, specFormInfo);
      config.type = 'textarea';
      config.fullWidth = true;
      return config;
    } else if (tdCodeParamSpecTypeList.includes(specFormInfo.type)) {
      const config: FlDynamicFieldConfig = this.convertToBaseFieldConfig(name, specFormInfo);
      config.type = specFormInfo.type;
      config.fullWidth = true;
      return config;
    } else if (specFormInfo.type === 'rich_text_param') {
      const config: FlDynamicFieldConfig = this.convertToBaseFieldConfig(name, specFormInfo);
      config.type = 'rich_text';
      config.fullWidth = true;
      return config;
    } else if (specFormInfo.type !== 'str' && specFormInfo.type !== 'int' && specFormInfo.type !== 'float') {
      const config: FlDynamicFieldConfig = this.convertToBaseFieldConfig(name, specFormInfo);
      config.type = specFormInfo.type;
      config.fullWidth = true;
      return config;
    }
    const config: FlDynamicFieldConfigInput = this.convertToBaseFieldConfig(name, specFormInfo) as any;
    config.type = 'input';
    config.inputType = specFormInfo.type === 'str' ? 'text' : 'number';
    return config;
  }

  private convertToBaseFieldConfig(
    name: string,
    specFormInfo: TdParamSpecFormInfo
  ): FlDynamicFieldConfigBase {
    return {
      controlType: 'formControl',
      type: null,
      required: !specFormInfo.optional,
      placeholder: this.translateService.translate('td.' + name),
    };
  }
}
