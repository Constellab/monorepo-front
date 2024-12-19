import { LabBaseEntity } from '../global/lab-entity.entity';
import {
  FlDynamicEditableFormGroupConfig,
  FlDynamicFormAbstractControl,
  FlDynamicFormGroupConfig
} from '@monorepo/front-core-lib';
import { PrConfigValues } from '@monorepo/protocol';
import {
  TdConfig,
  TdParamSpec,
  TdParamSpecConfig,
  TdParamSpecs,
  TdParamSpecVisibility
} from '@monorepo/technical-doc';
import { EventEmitter } from '@angular/core';

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
export class LabConfig extends LabBaseEntity implements TdConfig {
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
    config.values = config.getCleanConfigValues(values) ?? config.getDefaultConfig();
    return config;
  }

  /**
   * Get a FlDynamicFormFieldConfig based on config spec and params to create a form
   */
  public getDynamicFormFieldsConfig(visibility?: TdParamSpecVisibility): FlDynamicFormGroupConfig {
    return this.convertRecordToFieldConfigs(this.specs, visibility);
  }

  private convertRecordToFieldConfigs(
    record: TdParamSpecs,
    visibility?: TdParamSpecVisibility
  ): FlDynamicFormGroupConfig {
    const configs: FlDynamicFormGroupConfig = {
      controlType: 'formGroup',
      subConfigs: {},
    };
    for (const specName in record) {
      const configSpec: TdParamSpec = record[specName];

      // if a visibility is specified, only get the config for this visibility
      if (visibility && configSpec.visibility !== visibility) continue;
      configs.subConfigs[specName] = this.convertToAbstractConfig(record[specName], specName);
    }

    return configs;
  }

  private convertRecordToEditableFieldConfigs(
    record: TdParamSpecs,
    edition_mode: boolean
  ): FlDynamicEditableFormGroupConfig | FlDynamicFormGroupConfig {
    const configs: FlDynamicEditableFormGroupConfig | FlDynamicFormGroupConfig = edition_mode
      ? {
          placeholder: 'biox.dynamic_params',
          controlType: 'editableFormGroup',
          subConfigs: {},
          openEditConfigDialog: new EventEmitter<string>(),
        }
      : {
          controlType: 'formGroup',
          subConfigs: {},
        };
    for (const specName in record) {
      configs.subConfigs[specName] = this.convertToAbstractConfig(record[specName], specName);
    }
    return configs;
  }

  private convertToAbstractConfig(
    spec: TdParamSpec,
    defaultPlaceholder: string
  ): FlDynamicFormAbstractControl {
    if (spec.type === 'param_set') {
      const defaultValues = this.getConfigSpecDefaultValue(spec);
      return {
        controlType: 'formArray',
        formGpConfig: this.convertRecordToFieldConfigs(spec.additional_info.param_set),
        placeholder: spec.human_name ?? defaultPlaceholder,
        hint: spec.short_description,
        minSize: spec.optional ? 0 : 1,
        maxSize:
          spec.additional_info.max_number_of_occurrences > 0
            ? spec.additional_info.max_number_of_occurrences
            : null,
        newElementDefaultValue: defaultValues != null ? defaultValues[0] : null,
      };
    } else if (spec.type == 'dynamic') {
      return this.convertRecordToEditableFieldConfigs(
        spec.additional_info.specs,
        spec.additional_info.edition_mode
      );
    } else {
      return TdParamSpecConfig.convertParamSpecToAbstractConfig(spec, defaultPlaceholder);
    }
  }

  // TODO @vfoex c'est quoi ça ?
  public getCleanConfigValues(values: PrConfigValues, specs?: TdParamSpecs): PrConfigValues {
    if (!values) return null;
    const res: PrConfigValues = {};
    for (const specName of Object.keys(specs ?? this.specs)) {
      const spec: TdParamSpec = specs ? specs[specName] : this.specs[specName];
      if (spec.type === 'dynamic') {
        res[specName] = this.getCleanConfigValues(values[specName], spec.additional_info['specs']);
      } else {
        if (spec.type == 'dict' && specs) {
          res[specName] = JSON.stringify(values[specName]);
        } else {
          res[specName] = values[specName];
        }
      }
    }
    return res;
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
    } else if (spec.type === 'dynamic') {
      const defaultConfig: any = {};
      for (const subSpecName of Object.keys(spec.additional_info.specs)) {
        const subSpec: TdParamSpec = spec.additional_info.specs[subSpecName];
        defaultConfig[subSpecName] = subSpec.default_value;
      }
    } else {
      return spec.default_value ?? undefined;
    }
  }

  /**
   * Merge a config with the default to get the complete config
   * if not all the field are provided
   */
  public mergeConfigWithDefault(): any {
    const res = this.getNullConfig();
    for (const key in res) {
      if (this.values[key] != null) {
        res[key] = this.values[key];
      } else if (this.getDefaultConfig()[key] != null) {
        res[key] = this.getDefaultConfig()[key];
      }
    }
    return res;
  }

  public hasConfigs(visibility?: TdParamSpecVisibility): boolean {
    if (visibility == null) {
      if (this.specs && Object.keys(this.specs).length == 1) {
        return !(
          this.specs[Object.keys(this.specs)[0]].type == 'dynamic' &&
          !this.specs[Object.keys(this.specs)[0]].additional_info.edition_mode &&
          Object.keys(this.specs[Object.keys(this.specs)[0]].additional_info.specs).length == 0
        );
      }
      return this.specs != null && Object.keys(this.specs).length > 0;
    } else {
      return Object.values(this.specs).some((spec) => spec.visibility === visibility);
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
