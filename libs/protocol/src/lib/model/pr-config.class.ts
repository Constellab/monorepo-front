import { TdParamSpecsValues } from '@monorepo/technical-doc';

/**
 * Config object for a process
 */
export const PR_CONFIG_VALUE_ARE_EQUAL = (a: TdParamSpecsValues, b: TdParamSpecsValues): boolean => {
  return JSON.stringify(a) === JSON.stringify(b);
};
