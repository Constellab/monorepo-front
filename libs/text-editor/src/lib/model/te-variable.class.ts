export type TeVariableFormType = 'string' | 'number' | 'boolean';

export interface TeVariableFormInfo {
  name?: string;
  description?: string;
  value?: string | null;
  type?: TeVariableFormType;
}

export const TE_VARIABLE_TAG_NAME = 'te-variable-inline';
