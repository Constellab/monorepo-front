import { TdParamSpecs, TdParamSpecTypeEnum } from '../model/td-config-spec.class';

/**
 * Resolve the display name for a field path using specs human_name.
 * Falls back to the raw field path if no human_name is found.
 */
export function tdGetParamSpecDisplayName(fieldPath: string, specs?: TdParamSpecs): string {
  if (!specs) return fieldPath;

  // Direct key match
  const spec = specs[fieldPath];
  if (spec?.human_name) return spec.human_name;

  // Nested path: e.g. "samples[].weight" → look in param_set
  const parts = fieldPath.split('.');
  if (parts.length > 1) {
    const rootKey = parts[0].replace(/\[\]$/, '');
    const rootSpec = specs[rootKey];
    if (rootSpec?.type === TdParamSpecTypeEnum.PARAM_SET) {
      const nestedKey = parts.slice(1).join('.');
      const nestedSpec = rootSpec.additional_info?.param_set?.[nestedKey];
      if (nestedSpec?.human_name) {
        const rootName = rootSpec.human_name || rootKey;
        return `${rootName} > ${nestedSpec.human_name}`;
      }
    }
  }

  return fieldPath;
}
