import { TdParamSpecs, TdParamSpecTypeEnum } from '@monorepo/technical-doc';

import { LiFormChangeEntryDTO } from '../../model/li-form-save-event.entity';
import {
  liFormatChangeEntry,
  liGetChangeActionI18nKey,
  liGetChangeSummary,
  liGetFieldDisplayName,
} from './li-form-history.logic';

describe('li-form-history.logic', () => {
  describe('liGetChangeActionI18nKey', () => {
    it('should return correct i18n key for FIELD_CREATED', () => {
      expect(liGetChangeActionI18nKey('FIELD_CREATED')).toBe('li.form_field_created');
    });

    it('should return correct i18n key for FIELD_UPDATED', () => {
      expect(liGetChangeActionI18nKey('FIELD_UPDATED')).toBe('li.form_field_updated');
    });

    it('should return correct i18n key for FIELD_DELETED', () => {
      expect(liGetChangeActionI18nKey('FIELD_DELETED')).toBe('li.form_field_deleted');
    });

    it('should return correct i18n key for PARAMSET_ITEM_ADDED', () => {
      expect(liGetChangeActionI18nKey('PARAMSET_ITEM_ADDED')).toBe('li.form_item_added');
    });

    it('should return correct i18n key for PARAMSET_ITEM_REMOVED', () => {
      expect(liGetChangeActionI18nKey('PARAMSET_ITEM_REMOVED')).toBe('li.form_item_removed');
    });

    it('should return correct i18n key for STATUS_CHANGED', () => {
      expect(liGetChangeActionI18nKey('STATUS_CHANGED')).toBe('li.form_status_changed');
    });
  });

  describe('liFormatChangeEntry', () => {
    it('should format a field update entry', () => {
      const entry: LiFormChangeEntryDTO = {
        field_path: 'mass',
        action: 'FIELD_UPDATED',
        old_value: 1.4,
        new_value: 1.5,
      };

      const result = liFormatChangeEntry(entry);

      expect(result.fieldPath).toBe('mass');
      expect(result.displayName).toBe('mass');
      expect(result.actionI18nKey).toBe('li.form_field_updated');
      expect(result.oldValue).toBe('1.4');
      expect(result.newValue).toBe('1.5');
    });

    it('should use human_name from specs as displayName', () => {
      const specs: TdParamSpecs = {
        mass: {
          type: 'float',
          optional: false,
          visibility: 'public',
          human_name: 'Mass (kg)',
          additional_info: {},
        },
      };
      const entry: LiFormChangeEntryDTO = {
        field_path: 'mass',
        action: 'FIELD_UPDATED',
        old_value: 1.0,
        new_value: 2.0,
      };

      const result = liFormatChangeEntry(entry, specs);

      expect(result.displayName).toBe('Mass (kg)');
    });

    it('should format a field creation entry with null old value', () => {
      const entry: LiFormChangeEntryDTO = {
        field_path: 'volume',
        action: 'FIELD_CREATED',
        old_value: null,
        new_value: 2.3,
      };

      const result = liFormatChangeEntry(entry);

      expect(result.oldValue).toBeNull();
      expect(result.newValue).toBe('2.3');
    });

    it('should format a field deletion entry with null new value', () => {
      const entry: LiFormChangeEntryDTO = {
        field_path: 'notes',
        action: 'FIELD_DELETED',
        old_value: 'some text',
        new_value: null,
      };

      const result = liFormatChangeEntry(entry);

      expect(result.oldValue).toBe('some text');
      expect(result.newValue).toBeNull();
    });

    it('should stringify non-string values', () => {
      const entry: LiFormChangeEntryDTO = {
        field_path: 'active',
        action: 'FIELD_UPDATED',
        old_value: true,
        new_value: false,
      };

      const result = liFormatChangeEntry(entry);

      expect(result.oldValue).toBe('true');
      expect(result.newValue).toBe('false');
    });
  });

  describe('liGetFieldDisplayName', () => {
    const specs: TdParamSpecs = {
      mass: {
        type: 'float',
        optional: false,
        visibility: 'public',
        human_name: 'Mass (kg)',
        additional_info: {},
      },
      name: {
        type: 'str',
        optional: true,
        visibility: 'public',
        additional_info: {},
      },
      samples: {
        type: TdParamSpecTypeEnum.PARAM_SET,
        optional: true,
        visibility: 'public',
        human_name: 'Samples',
        additional_info: {
          param_set: {
            weight: {
              type: 'float',
              optional: true,
              visibility: 'public',
              human_name: 'Weight',
              additional_info: {},
            },
          },
          max_number_of_occurrences: 10,
        },
      },
    };

    it('should return human_name when available', () => {
      expect(liGetFieldDisplayName('mass', specs)).toBe('Mass (kg)');
    });

    it('should fall back to key when no human_name', () => {
      expect(liGetFieldDisplayName('name', specs)).toBe('name');
    });

    it('should fall back to key when no specs', () => {
      expect(liGetFieldDisplayName('mass')).toBe('mass');
    });

    it('should resolve nested param_set fields', () => {
      expect(liGetFieldDisplayName('samples[].weight', specs)).toBe('Samples > Weight');
    });

    it('should fall back to path for unknown nested fields', () => {
      expect(liGetFieldDisplayName('samples[].unknown', specs)).toBe('samples[].unknown');
    });
  });

  describe('liGetChangeSummary', () => {
    it('should return i18n key for empty changes', () => {
      expect(liGetChangeSummary([])).toBe('li.form_no_changes');
    });

    it('should return count as string for non-empty changes', () => {
      const changes: LiFormChangeEntryDTO[] = [
        { field_path: 'a', action: 'FIELD_UPDATED', old_value: 1, new_value: 2 },
        { field_path: 'b', action: 'FIELD_CREATED', old_value: null, new_value: 'x' },
        { field_path: 'c', action: 'FIELD_DELETED', old_value: 'y', new_value: null },
      ];

      expect(liGetChangeSummary(changes)).toBe('3');
    });
  });
});
