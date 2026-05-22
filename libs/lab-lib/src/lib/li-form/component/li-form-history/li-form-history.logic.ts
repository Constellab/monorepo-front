import { tdGetParamSpecDisplayName,TdParamSpecs } from '@monorepo/technical-doc';

import { LiFormChangeAction } from '../../../li-core/model/entities/form/li-form.enum';
import { LiFormChangeEntryDTO } from '../../../li-core/model/entities/form/li-form-save-event.entity';

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
    displayName: tdGetParamSpecDisplayName(entry.field_path, specs),
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
