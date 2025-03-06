import { TdParamSpecsValues } from '@monorepo/technical-doc';

/**
 * Config object for a process
 */
export const prConfigValueAreEqual = (a: TdParamSpecsValues, b: TdParamSpecsValues): boolean => {
  return JSON.stringify(a) === JSON.stringify(b);
};
