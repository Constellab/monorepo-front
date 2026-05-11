import {
  TdParamSpecs,
  TdParamSpecsValues,
  TdParamSpecType,
  TdParamSpecTypeEnum,
} from '@monorepo/technical-doc';

import { LiSaveFormDTO } from '../../model/li-form.entity';

/**
 * Check whether a spec key corresponds to a computed field.
 */
export function liIsFieldComputed(schema: TdParamSpecs, key: string): boolean {
  const spec = schema[key];
  return (spec?.type as TdParamSpecType) === 'computed_param';
}

/**
 * Process ParamSet items: preserve `__item_id` for existing items, omit for new items.
 */
function liProcessParamSetItems(items: Record<string, unknown>[]): Record<string, unknown>[] {
  return items.map((item) => {
    const processed = { ...item };
    if (processed['__item_id'] == null || processed['__item_id'] === '') {
      delete processed['__item_id'];
    }
    return processed;
  });
}

/**
 * Strip computed field values and process ParamSet items from raw form values.
 */
export function liExtractSavePayload(
  rawValues: TdParamSpecsValues,
  schema: TdParamSpecs
): TdParamSpecsValues {
  const result: TdParamSpecsValues = {};

  for (const key of Object.keys(rawValues)) {
    const spec = schema[key];

    // Strip computed fields
    if (liIsFieldComputed(schema, key)) {
      continue;
    }

    const value = rawValues[key];

    // Process ParamSet items for __item_id handling
    if (spec?.type === TdParamSpecTypeEnum.PARAM_SET && Array.isArray(value)) {
      result[key] = liProcessParamSetItems(value as Record<string, unknown>[]);
    } else {
      result[key] = value;
    }
  }

  return result;
}

/**
 * Build the DTO for saving form values.
 */
export function liBuildSaveDTO(
  values: TdParamSpecsValues,
  statusTransition?: 'SUBMITTED' | null
): LiSaveFormDTO {
  const dto: LiSaveFormDTO = { values };
  if (statusTransition) {
    dto.status_transition = statusTransition;
  }
  return dto;
}
