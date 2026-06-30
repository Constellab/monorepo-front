import { ClHelpService } from '@monorepo/core-lib';
import {
  FlDynamicEditableFormGroupConfig,
  FlDynamicFormAbstractControl,
  FlDynamicFormGroupConfig,
} from '@monorepo/front-core-lib/fl-dynamic-field';

import {
  TdParamSetDefaultRowsMode,
  TdParamSpec,
  TdParamSpecs,
  TdParamSpecsValues,
  TdParamSpecTypeEnum,
  TdParamSpecVisibility,
} from './td-config-spec.class';
import { TdParamSpecConfig } from './td-param-spec-config.class';

export interface TdConfigI {
  // object describing the type of the configs and default values
  specs: TdParamSpecs;

  // actual values of the config
  values: TdParamSpecsValues;
}

/**
 * Config object for a process
 */
export class TdConfig implements TdConfigI {
  // object describing the type of the configs and default values
  specs: TdParamSpecs;

  // actual values of the config
  values: TdParamSpecsValues;

  /**
   * Create a ConfigData with defined specs and empty params
   * if the values are not provided, use the default config
   */
  public static fromSpecs(specs: TdParamSpecs, values?: TdParamSpecsValues): TdConfig {
    const config = new TdConfig();
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
      configSpec.human_name = configSpec.human_name ?? specName;

      // if a visibility is specified, only get the config for this visibility
      if (visibility && configSpec.visibility !== visibility) continue;
      configs.subConfigs[specName] = this.convertToAbstractConfig(record[specName]);
    }
    return configs;
  }

  private convertRecordToEditableFieldConfigs(
    record: TdParamSpecs,
    editionMode: boolean,
    humanName: string,
    shortDescription: string
  ): FlDynamicEditableFormGroupConfig | FlDynamicFormGroupConfig {
    const subConfigs: Record<string, FlDynamicFormAbstractControl> = {};
    for (const specName in record) {
      const spec: TdParamSpec = record[specName];
      spec.human_name = spec.human_name ?? specName;
      subConfigs[specName] = this.convertToAbstractConfig(record[specName]);
    }
    if (editionMode) {
      return {
        controlType: 'editableFormGroup',
        subConfigs: subConfigs,
        placeholder: humanName,
        hint: shortDescription,
      };
    } else {
      return {
        controlType: 'formGroup',
        subConfigs: subConfigs,
      };
    }
  }

  private convertToAbstractConfig(spec: TdParamSpec): FlDynamicFormAbstractControl {
    if (spec.type === TdParamSpecTypeEnum.PARAM_SET) {
      const info = spec.additional_info;
      const lockProvided = info.default_rows_mode === TdParamSetDefaultRowsMode.LOCK_PROVIDED;
      return {
        controlType: 'formArray',
        formGpConfig: this.convertRecordToFieldConfigs(info.param_set),
        placeholder: spec.human_name,
        hint: spec.short_description,
        minSize: info.min_number_of_occurrences ?? (spec.optional ? 0 : 1),
        maxSize: info.max_number_of_occurrences > 0 ? info.max_number_of_occurrences : null,
        // In LOCK_PROVIDED mode, the preset cells that hold a value are read-only;
        // empty cells stay editable. Rows can still be added/removed in both modes.
        lockedRowsKeys: lockProvided ? this.getLockedRowsKeys(info.default_rows) : null,
        // A newly added row is a blank (column-default) row, not a copy of a preset row.
        newElementDefaultValue: this.getParamSetColumnDefaults(spec),
      };
    } else if (spec.type == 'dynamic') {
      return this.convertRecordToEditableFieldConfigs(
        spec.additional_info.specs,
        spec.additional_info.edition_mode,
        spec.human_name,
        spec.short_description
      );
    } else {
      return TdParamSpecConfig.convertParamSpecToAbstractConfig(spec);
    }
  }

  // TODO @vfoex c'est quoi ça ?
  public getCleanConfigValues(values: TdParamSpecsValues, specs?: TdParamSpecs): TdParamSpecsValues {
    if (!values) return null;
    const res: TdParamSpecsValues = {};
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
  public getDefaultConfig(): TdParamSpecsValues {
    const defaultConfig: TdParamSpecsValues = {};
    for (const specName of Object.keys(this.specs)) {
      const spec: TdParamSpec = this.specs[specName];
      // An optional param set defaults to null only when it has no preset rows.
      // If default rows are configured, they must appear in the form (with the
      // editability defined by default_rows_mode).
      const hasDefaultRows =
        spec.type === TdParamSpecTypeEnum.PARAM_SET &&
        Array.isArray(spec.additional_info?.default_rows) &&
        spec.additional_info.default_rows.length > 0;
      if (spec.type === TdParamSpecTypeEnum.PARAM_SET && spec.optional && !hasDefaultRows) {
        defaultConfig[specName] = null;
      } else {
        defaultConfig[specName] = this.getConfigSpecDefaultValue(this.specs[specName]);
      }
    }
    return defaultConfig;
  }

  /**
   * For a param set with locked default rows, returns the list of cell keys to
   * lock per row: a cell is locked when the preset (partial) row provides a
   * non-empty value for it. Empty cells are left editable so the user can fill
   * the missing values.
   */
  private getLockedRowsKeys(defaultRows: TdParamSpecsValues[]): string[][] {
    if (!Array.isArray(defaultRows)) return [];
    return defaultRows.map((row) =>
      Object.keys(row ?? {}).filter((key) => {
        const value = row[key];
        return value !== null && value !== undefined && value !== '';
      })
    );
  }

  /**
   * return the default value for 1 config spec.
   * If the config is a param_set, return the default value with recursive call
   * @param spec
   * @private
   */
  /**
   * Build a single empty row for a param set: each column set to its own default
   * value (recursively). Used as the initial value of a fresh/added row.
   */
  private getParamSetColumnDefaults(spec: TdParamSpec): any {
    if (spec.type !== TdParamSpecTypeEnum.PARAM_SET) return null;
    const columnDefaults: any = {};
    for (const subSpecName of Object.keys(spec.additional_info.param_set)) {
      const subSpec: TdParamSpec = spec.additional_info.param_set[subSpecName];
      columnDefaults[subSpecName] = this.getConfigSpecDefaultValue(subSpec);
    }
    return columnDefaults;
  }

  private getConfigSpecDefaultValue(spec: TdParamSpec): any {
    if (spec.type === TdParamSpecTypeEnum.PARAM_SET) {
      const info = spec.additional_info;

      // Build the per-column default row (recursively).
      const columnDefaults = this.getParamSetColumnDefaults(spec);

      const rows: any[] = [];

      // First, the configured preset rows: merge each partial row over the
      // column defaults (partial values win, missing keys fall back to defaults).
      if (Array.isArray(info.default_rows) && info.default_rows.length > 0) {
        for (const row of info.default_rows) {
          rows.push({ ...ClHelpService.deepClone(columnDefaults), ...(row ?? {}) });
        }
      }

      // Then pad with empty (column-default) rows to reach the minimum number of
      // occurrences. At least one row when there is no preset row at all.
      const minRows = Math.max(info.min_number_of_occurrences ?? 0, rows.length > 0 ? 0 : 1);
      while (rows.length < minRows) {
        rows.push(ClHelpService.deepClone(columnDefaults));
      }

      return rows;
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

  /**
   * Split flat values into { public, protected } based on spec visibility.
   */
  public splitValuesByVisibility(values: TdParamSpecsValues): {
    public: TdParamSpecsValues;
    protected: TdParamSpecsValues;
  } {
    const pub: TdParamSpecsValues = {};
    const prot: TdParamSpecsValues = {};
    for (const key of Object.keys(values)) {
      const visibility = this.specs[key]?.visibility;
      if (visibility === 'protected') {
        prot[key] = values[key];
      } else {
        pub[key] = values[key];
      }
    }
    return { public: pub, protected: prot };
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
