export type TeVariableFormType = 'string' | 'number' | 'boolean';

export interface TeVariableFormInfo {
  name?: string;
  description?: string;
  value?: string;
  type?: TeVariableFormType;
}

export const teVariableTagName = 'te-variable-inline';
export const teVariableAttribute = 'data-jsondata';
