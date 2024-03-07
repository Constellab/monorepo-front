import {TdParamSpecs} from '@monorepo/technical-doc';

export type PrConfigValues = Record<string, any>


/**
 * Config object for a process
 */
export interface PrConfig {

  // object describing the type of the configs and default values
  specs: TdParamSpecs;

  // actual values of the config
  values: PrConfigValues;
}

export const prConfigValueAreEqual = (a: PrConfigValues, b: PrConfigValues): boolean => {
  return JSON.stringify(a) === JSON.stringify(b);
}
