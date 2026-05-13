import { TdParamSpecs, TdParamSpecTypeEnum } from '@monorepo/technical-doc';

import { liBuildSaveDTO, liExtractSavePayload, liIsFieldComputed } from './li-form-editor.logic';

describe('li-form-editor.logic', () => {
  const schema: TdParamSpecs = {
    mass: {
      type: 'float',
      optional: false,
      visibility: 'public',
      additional_info: { min_value: 0 },
    },
    name: {
      type: 'str',
      optional: true,
      visibility: 'public',
      additional_info: {},
    },
    total: {
      type: 'computed_param',
      optional: true,
      visibility: 'public',
      additional_info: { expression: 'mass * 2', result_type: 'float' },
    },
    samples: {
      type: TdParamSpecTypeEnum.PARAM_SET,
      optional: true,
      visibility: 'public',
      additional_info: {
        param_set: {
          label: { type: 'str', optional: false, visibility: 'public', additional_info: {} },
          weight: { type: 'float', optional: true, visibility: 'public', additional_info: {} },
        },
        max_number_of_occurrences: 10,
      },
    },
  };

  describe('liIsFieldComputed', () => {
    it('should return true for computed fields', () => {
      expect(liIsFieldComputed(schema, 'total')).toBe(true);
    });

    it('should return false for non-computed fields', () => {
      expect(liIsFieldComputed(schema, 'mass')).toBe(false);
      expect(liIsFieldComputed(schema, 'name')).toBe(false);
    });

    it('should return false for unknown keys', () => {
      expect(liIsFieldComputed(schema, 'nonexistent')).toBe(false);
    });
  });

  describe('liExtractSavePayload', () => {
    it('should strip values for computed fields', () => {
      const rawValues = { mass: 1.5, name: 'Test', total: 3.0 };
      const result = liExtractSavePayload(rawValues, schema);

      expect(result).toEqual({ mass: 1.5, name: 'Test' });
      expect(result['total']).toBeUndefined();
    });

    it('should preserve __item_id for existing ParamSet items', () => {
      const rawValues = {
        mass: 1.0,
        samples: [{ __item_id: 'abc-123', label: 'Sample A', weight: 0.5 }],
      };
      const result = liExtractSavePayload(rawValues, schema);

      expect(result['samples']).toEqual([{ __item_id: 'abc-123', label: 'Sample A', weight: 0.5 }]);
    });

    it('should omit __item_id for new ParamSet items (null)', () => {
      const rawValues = {
        mass: 1.0,
        samples: [{ __item_id: null, label: 'New Sample', weight: 1.0 }],
      };
      const result = liExtractSavePayload(rawValues, schema);

      expect((result['samples'] as Record<string, unknown>[])[0]['__item_id']).toBeUndefined();
      expect((result['samples'] as Record<string, unknown>[])[0]['label']).toBe('New Sample');
    });

    it('should omit __item_id for new ParamSet items (empty string)', () => {
      const rawValues = {
        mass: 1.0,
        samples: [{ __item_id: '', label: 'New Sample', weight: 1.0 }],
      };
      const result = liExtractSavePayload(rawValues, schema);

      expect((result['samples'] as Record<string, unknown>[])[0]['__item_id']).toBeUndefined();
    });

    it('should handle mixed existing and new ParamSet items', () => {
      const rawValues = {
        mass: 1.0,
        samples: [
          { __item_id: 'existing-1', label: 'Old', weight: 0.5 },
          { __item_id: null, label: 'New', weight: 1.0 },
        ],
      };
      const result = liExtractSavePayload(rawValues, schema);
      const items = result['samples'] as Record<string, unknown>[];

      expect(items[0]['__item_id']).toBe('existing-1');
      expect(items[1]['__item_id']).toBeUndefined();
    });

    it('should pass through non-computed, non-param_set values unchanged', () => {
      const rawValues = { mass: 2.5, name: 'Hello' };
      const result = liExtractSavePayload(rawValues, schema);

      expect(result).toEqual({ mass: 2.5, name: 'Hello' });
    });
  });

  describe('liBuildSaveDTO', () => {
    it('should build a save DTO without status transition', () => {
      const values = { mass: 1.5, name: 'Test' };
      const dto = liBuildSaveDTO(values);

      expect(dto).toEqual({ values: { mass: 1.5, name: 'Test' } });
      expect(dto.status_transition).toBeUndefined();
    });

    it('should build a save DTO with SUBMITTED status transition', () => {
      const values = { mass: 1.5 };
      const dto = liBuildSaveDTO(values, 'SUBMITTED');

      expect(dto).toEqual({ values: { mass: 1.5 }, status_transition: 'SUBMITTED' });
    });

    it('should not include status_transition when null', () => {
      const values = { mass: 1.5 };
      const dto = liBuildSaveDTO(values, null);

      expect(dto.status_transition).toBeUndefined();
    });
  });
});
