import { TdParamSpecs, TdParamSpecTypeEnum } from '@monorepo/technical-doc';

import { LiFormChangeAction } from '../../model/li-form.enum';
import { LiFormChangeEntryDTO } from '../../model/li-form-save-event.entity';

const LI_CHANGE_ACTION_I18N_MAP: Record<LiFormChangeAction, string> = {
  FIELD_CREATED: 'li.form_field_created',
  FIELD_UPDATED: 'li.form_field_updated',
  FIELD_DELETED: 'li.form_field_deleted',
  PARAMSET_ITEM_ADDED: 'li.form_item_added',
  PARAMSET_ITEM_REMOVED: 'li.form_item_removed',
  STATUS_CHANGED: 'li.form_status_changed',
};

export function liGetChangeActionI18nKey(action: LiFormChangeAction): string {
  return LI_CHANGE_ACTION_I18N_MAP[action] ?? action;
}

/**
 * Resolve the display name for a field path using specs human_name.
 * Falls back to the raw field path if no human_name is found.
 */
export function liGetFieldDisplayName(fieldPath: string, specs?: TdParamSpecs): string {
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

export interface LiFormattedChangeEntry {
  fieldPath: string;
  displayName: string;
  actionI18nKey: string;
  oldValue: string | null;
  newValue: string | null;
}

export function liFormatChangeEntry(
  entry: LiFormChangeEntryDTO,
  specs?: TdParamSpecs
): LiFormattedChangeEntry {
  return {
    fieldPath: entry.field_path,
    displayName: liGetFieldDisplayName(entry.field_path, specs),
    actionI18nKey: liGetChangeActionI18nKey(entry.action),
    oldValue: entry.old_value != null ? String(entry.old_value) : null,
    newValue: entry.new_value != null ? String(entry.new_value) : null,
  };
}

export function liGetChangeSummary(changes: LiFormChangeEntryDTO[]): string {
  if (changes.length === 0) {
    return 'li.form_no_changes';
  }
  return `${changes.length}`;
}
