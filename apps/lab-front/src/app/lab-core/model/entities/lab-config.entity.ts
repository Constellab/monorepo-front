import {LabBaseEntity} from '../global/lab-entity.entity';
import {
  FlDynamicFieldConfig,
  FlDynamicFieldConfigBase,
  FlDynamicFieldConfigBoolean,
  FlDynamicFieldConfigInput,
  FlDynamicFieldConfigList,
  FlDynamicFieldConfigSelect,
  FlDynamicFieldConfigSelectSearch,
  FlDynamicFieldConfigUnknown,
  FlDynamicFormAbstractControl,
  FlDynamicFormGroupConfig
} from '@monorepo/front-core-lib';
import {PrConfigValues} from '@monorepo/protocol';
import {
  tdCodeParamSpecTypeList,
  TdParamSpec,
  TdParamSpecs,
  TdParamSpecSimple,
  TdParamSpecVisibility
} from '@monorepo/technical-doc';

/**
 * form structure for the {@link LabConfigureSpecsFormComponent}
 */
export interface LabConfigureSpecsForm {
  public: PrConfigValues;
  protected: PrConfigValues;
}

/**
 * Config object for a process
 */
export class LabConfig extends LabBaseEntity {

  // object describing the type of the configs and default values
  specs: TdParamSpecs;

  // actual values of the config
  values: PrConfigValues;

  /**
   * Create a ConfigData with defined specs and empty params
   * if the values are not provided, use the default config
   */
  public static fromSpecs(specs: TdParamSpecs, values?: PrConfigValues): LabConfig {
    const config = new LabConfig();
    config.specs = specs;
    config.values = values ?? config.getDefaultConfig();
    return config;
  }

  /**
   * Get a FlDynamicFormFieldConfig based on config spec and params to create a form
   */
  public getDynamicFormFieldsConfig(visibility?: TdParamSpecVisibility): FlDynamicFormGroupConfig {
    return this.convertToFieldConfigs(visibility);
  }

  /**
   * Method to convert the ConfigSpec to a FlDynamicFormFieldConfig to create a form
   */
  public convertToFieldConfigs(visibility?: TdParamSpecVisibility): FlDynamicFormGroupConfig {
    return this.convertRecordToFieldConfigs(this.specs, visibility);
  }


  private convertRecordToFieldConfigs(record: TdParamSpecs, visibility?: TdParamSpecVisibility)
    : FlDynamicFormGroupConfig {
    const configs: FlDynamicFormGroupConfig = {
      controlType: 'formGroup',
      subConfigs: {}
    };
    for (const specName in record) {
      const configSpec: TdParamSpec = record[specName];

      // if a visibility is specified, only get the config for this visibility
      if (visibility && configSpec.visibility !== visibility) continue;
      configs.subConfigs[specName] = this.convertToAbstractConfig(record[specName], specName);
    }

    return configs;
  }


  private convertToAbstractConfig(spec: TdParamSpec, defaultPlaceholder: string): FlDynamicFormAbstractControl {
    if (spec.type === 'param_set') {
      const defaultValues = this.getConfigSpecDefaultValue(spec);
      return {
        controlType: 'formArray',
        formGpConfig: this.convertRecordToFieldConfigs(spec.additional_info.param_set),
        placeholder: spec.human_name ?? defaultPlaceholder,
        hint: spec.short_description,
        minSize: spec.optional ? 0 : 1,
        maxSize: spec.additional_info.max_number_of_occurrences > 0 ? spec.additional_info.max_number_of_occurrences : null,
        newElementDefaultValue: defaultValues != null ? defaultValues[0] : null,
      };
    } else {
      return this.convertToControlConfig(spec, defaultPlaceholder);
    }
  }

  private convertToControlConfig(spec: TdParamSpecSimple, defaultPlaceholder: string): FlDynamicFieldConfig {
    // create a select
    if (spec.allowed_values) {
      if (spec.allowed_values.length > 10) {
        const config: FlDynamicFieldConfigSelectSearch = this.convertToBaseFieldConfig(spec, defaultPlaceholder) as any;
        config.type = 'select-search';
        config.selectOptions = spec.allowed_values;
        return config;
      } else {
        const config: FlDynamicFieldConfigSelect = this.convertToBaseFieldConfig(spec, defaultPlaceholder) as any;
        config.type = 'select';
        config.selectOptions = spec.allowed_values;
        config.suffix = spec.unit;
        return config;
      }
    } else if (spec.type === 'list') {
      const config: FlDynamicFieldConfigList = this.convertToBaseFieldConfig(spec, defaultPlaceholder) as any;
      config.type = 'list';
      return config;
    } else if (spec.type === 'bool') {
      const config: FlDynamicFieldConfigBoolean = this.convertToBaseFieldConfig(spec, defaultPlaceholder) as any;
      config.type = 'boolean';
      return config;
    } else if (spec.type === 'tags_param') {
      const config: FlDynamicFieldConfig = this.convertToBaseFieldConfig(spec, defaultPlaceholder) as any;
      config.type = 'tags';
      return config;
    } else if (spec.type === 'open_ai_chat_param') {
      const config: FlDynamicFieldConfig = this.convertToBaseFieldConfig(spec, defaultPlaceholder) as any;
      config.type = 'open_ai_chat';
      config.fullWidth = true;
      return config;
    } else if (spec.type === 'credentials_param') {
      const config: FlDynamicFieldConfigUnknown = this.convertToBaseFieldConfig(spec, defaultPlaceholder) as any;
      config.type = 'select_credentials';
      config.additionalInfo = {credentialsType: spec.additional_info.credentials_type};
      return config;
    } else if (spec.type === 'report_template_param') {
      const config: FlDynamicFieldConfigUnknown = this.convertToBaseFieldConfig(spec, defaultPlaceholder) as any;
      config.type = 'select_report_template';
      return config;
    } else if (spec.type === 'report_param') {
      const config: FlDynamicFieldConfigUnknown = this.convertToBaseFieldConfig(spec, defaultPlaceholder) as any;
      config.type = 'select_report';
      return config;
    } else if (tdCodeParamSpecTypeList.includes(spec.type)) {
      const config: FlDynamicFieldConfig = this.convertToBaseFieldConfig(spec, defaultPlaceholder) as any;
      config.type = spec.type;
      config.fullWidth = true;
      return config;
    } else if (spec.type === 'text') {
      const config: FlDynamicFieldConfig = this.convertToBaseFieldConfig(spec, defaultPlaceholder) as any;
      config.type = 'textarea';
      config.fullWidth = true;
      return config;
    } else if (spec.type === 'rich_text_param') {
      const config: FlDynamicFieldConfig = this.convertToBaseFieldConfig(spec, defaultPlaceholder) as any;
      config.type = 'rich_text';
      config.fullWidth = true;
      return config;
    } else {
      const config: FlDynamicFieldConfigInput = this.convertToBaseFieldConfig(spec, defaultPlaceholder) as any;
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

  private convertToBaseFieldConfig(spec: TdParamSpec, defaultPlaceholder: string): FlDynamicFieldConfigBase {
    return {
      controlType: 'formControl',
      type: null,
      required: !spec.optional,
      placeholder: spec.human_name ?? defaultPlaceholder,
      hint: spec.short_description,
    };
  }

  /**
   * return the complete default config object
   */
  public getDefaultConfig(): PrConfigValues {
    const defaultConfig: PrConfigValues = {};
    for (const specName of Object.keys(this.specs)) {
      const spec: TdParamSpec = this.specs[specName];
      if (spec.type === 'param_set' && spec.optional) {
        defaultConfig[specName] = null;
      } else {
        defaultConfig[specName] = this.getConfigSpecDefaultValue(this.specs[specName]);
      }
    }
    return defaultConfig;
  }

  /**
   * return the default value for 1 config spec.
   * If the config is a param_set, return the default value with recursive call
   * @param spec
   * @private
   */
  private getConfigSpecDefaultValue(spec: TdParamSpec): any {
    if (spec.type === 'param_set') {

      const defaultConfig: any = {};
      for (const subSpecName of Object.keys(spec.additional_info.param_set)) {
        const subSpec: TdParamSpec = spec.additional_info.param_set[subSpecName];
        defaultConfig[subSpecName] = this.getConfigSpecDefaultValue(subSpec);
      }

      // return an array of 1 element with the default value
      return [defaultConfig];
    } else {
      return spec.default_value ?? undefined;
    }
  }

  /**
   * Merge a config with the default to get the complete config
   * if not all the field are provided
   */
  public mergeConfigWithDefault(): any {
    return Object.assign(this.getNullConfig(), this.getDefaultConfig(), this.values);
  }

  public hasConfigs(visibility?: TdParamSpecVisibility): boolean {
    if (visibility == null) {
      return this.specs != null && Object.keys(this.specs).length > 0;
    } else {
      return Object.values(this.specs).some(spec => spec.visibility === visibility);
    }
  }

  // get the config value with only null vales
  public getNullConfig(): Record<string, null> {
    const nullConfig: Record<string, null> = {};
    for (const recordKey in this.specs) {
      nullConfig[recordKey] = null;
    }
    return nullConfig;
  }
}





