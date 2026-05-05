import { FlSearchConverter } from '@monorepo/front-core-lib/fl-search';
import { DateTime } from 'luxon';

import { LiSearchConverter } from '../../li-core/model/global/li-search-converter.class';
import { LiFormTemplateSearch } from './li-form-template-search';

describe('LiFormTemplateSearch', () => {
  describe('filterConverter', () => {
    it('should have a name filter with CONTAINS operator', () => {
      expect(LiFormTemplateSearch.filterConverter.name).toEqual({ key: 'name', operator: 'CONTAINS' });
    });

    it('should have a tags filter with EQ operator', () => {
      expect(LiFormTemplateSearch.filterConverter.tags).toEqual({ key: 'tags', operator: 'EQ' });
    });

    it('should have a createdBy filter with EQ operator and getEntityId converter', () => {
      expect(LiFormTemplateSearch.filterConverter.createdBy).toEqual({
        key: 'created_by',
        operator: 'EQ',
        convertValue: FlSearchConverter.getEntityId,
      });
    });

    it('should have a createdAt filter using dateInterval', () => {
      const converter = LiFormTemplateSearch.filterConverter.createdAt;
      expect(converter).toBeDefined();
      expect(typeof converter).toBe('function');
      const result = (converter as any)({ from: DateTime.now(), to: null });
      expect(result[0].key).toBe('created_at');
    });

    it('should have an isArchived filter with EQ operator and includeAllOnCheck converter', () => {
      expect(LiFormTemplateSearch.filterConverter.isArchived).toEqual({
        key: 'is_archived',
        operator: 'EQ',
        convertValue: LiSearchConverter.includeAllOnCheck,
      });
    });
  });

  describe('sortConverter', () => {
    it('should have name sort key', () => {
      expect(LiFormTemplateSearch.sortConverter['name']).toBe('name');
    });

    it('should have created_at sort key', () => {
      expect(LiFormTemplateSearch.sortConverter['created_at']).toBe('created_at');
    });

    it('should have last_modified_at sort key', () => {
      expect(LiFormTemplateSearch.sortConverter['last_modified_at']).toBe('last_modified_at');
    });
  });

  describe('getSearchForm', () => {
    it('should return a FormGroup with expected controls', () => {
      const form = LiFormTemplateSearch.getSearchForm();
      expect(form.get('name')).toBeTruthy();
      expect(form.get('tags')).toBeTruthy();
      expect(form.get('createdBy')).toBeTruthy();
      expect(form.get('createdAt')).toBeTruthy();
      expect(form.get('createdAt.from')).toBeTruthy();
      expect(form.get('createdAt.to')).toBeTruthy();
      expect(form.get('isArchived')).toBeTruthy();
    });
  });
});
