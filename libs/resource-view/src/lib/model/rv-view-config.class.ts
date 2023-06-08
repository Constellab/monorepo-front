export interface RvViewConfig {
  methodName: string;
  configValues: RvConfigValues;
}

export type RvConfigValues = Record<string, any>
