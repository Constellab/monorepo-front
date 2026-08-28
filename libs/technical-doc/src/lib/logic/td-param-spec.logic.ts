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
  return getNestedParamSpecDisplayName(fieldPath, specs) ?? fieldPath;
}

/**
 * Resolve the display name of a nested field path (e.g. "samples[].weight") using the
 * human_name of the param_set root and of the nested spec.
 * Returns null when the path is not a resolvable nested path.
 */
function getNestedParamSpecDisplayName(fieldPath: string, specs: TdParamSpecs): string | null {
  const parts = fieldPath.split('.');
  if (parts.length <= 1) return null;

  const rootKey = parts[0].replace(/\[\]$/, '');
  const rootSpec = specs[rootKey];
  if (!rootSpec || rootSpec.type !== TdParamSpecTypeEnum.PARAM_SET) return null;

  const nestedKey = parts.slice(1).join('.');
  const nestedSpec = rootSpec.additional_info?.param_set?.[nestedKey];
  if (!nestedSpec?.human_name) return null;

  const rootName = rootSpec.human_name || rootKey;
  return `${rootName} > ${nestedSpec.human_name}`;
}
