import { TestBed } from '@angular/core/testing';
import { FlApiService } from '@monorepo/front-core-lib/fl-api';
import { of } from 'rxjs';

import { LiForm, LiFormFull } from '../model/li-form.entity';
import { LiFormSaveEvent } from '../model/li-form-save-event.dto';
import { LiFormService } from './li-form.service';

describe('LiFormService', () => {
  let service: LiFormService;
  let apiServiceSpy: {
    get: ReturnType<typeof vi.fn>;
    post: ReturnType<typeof vi.fn>;
    put: ReturnType<typeof vi.fn>;
    delete: ReturnType<typeof vi.fn>;
  };

  beforeEach(() => {
    apiServiceSpy = {
      get: vi.fn().mockReturnValue(of({})),
      post: vi.fn().mockReturnValue(of({})),
      put: vi.fn().mockReturnValue(of({})),
      delete: vi.fn().mockReturnValue(of(undefined)),
    };

    TestBed.configureTestingModule({
      providers: [LiFormService, { provide: FlApiService, useValue: apiServiceSpy }],
    });
    service = TestBed.inject(LiFormService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('create', () => {
    it('should POST to form', () => {
      const dto = { template_version_id: 'ver-1' };
      service.create(dto);
      expect(apiServiceSpy.post).toHaveBeenCalledWith('form', dto, LiFormFull);
    });
  });

  describe('getById', () => {
    it('should GET form/{id}', () => {
      service.getById('form-1');
      expect(apiServiceSpy.get).toHaveBeenCalledWith('form/form-1', LiFormFull);
    });
  });

  describe('update', () => {
    it('should PUT form/{id}', () => {
      const dto = { name: 'Updated Form' };
      service.update('form-1', dto);
      expect(apiServiceSpy.put).toHaveBeenCalledWith('form/form-1', dto, LiForm);
    });
  });

  describe('save', () => {
    it('should POST to form/{id}/save', () => {
      const dto = { values: { mass: 1.5 } };
      service.save('form-1', dto);
      expect(apiServiceSpy.post).toHaveBeenCalledWith('form/form-1/save', dto);
    });
  });

  describe('submit', () => {
    it('should POST to form/{id}/submit', () => {
      const dto = { values: { mass: 1.5 }, status_transition: 'SUBMITTED' as const };
      service.submit('form-1', dto);
      expect(apiServiceSpy.post).toHaveBeenCalledWith('form/form-1/submit', dto);
    });
  });

  describe('delete', () => {
    it('should DELETE form/{id}', () => {
      service.delete('form-1');
      expect(apiServiceSpy.delete).toHaveBeenCalledWith('form/form-1');
    });
  });

  describe('search', () => {
    it('should POST to form/search with pagination', () => {
      const data = { filters: {}, sorts: [] } as any;
      service.search(0, 20, data);
      expect(apiServiceSpy.post).toHaveBeenCalledWith(
        'form/search',
        expect.any(Object),
        LiForm,
        expect.objectContaining({ page: 0, pageSize: 20, resultIsPaginated: true })
      );
    });
  });

  describe('archive', () => {
    it('should PUT form/{id}/archive', () => {
      service.archive('form-1');
      expect(apiServiceSpy.put).toHaveBeenCalledWith('form/form-1/archive', null, LiForm);
    });
  });

  describe('unarchive', () => {
    it('should PUT form/{id}/unarchive', () => {
      service.unarchive('form-1');
      expect(apiServiceSpy.put).toHaveBeenCalledWith('form/form-1/unarchive', null, LiForm);
    });
  });

  describe('getHistory', () => {
    it('should GET form/{id}/history with pagination', () => {
      service.getHistory('form-1', 0, 10);
      expect(apiServiceSpy.get).toHaveBeenCalledWith(
        'form/form-1/history',
        LiFormSaveEvent,
        expect.objectContaining({ page: 0, pageSize: 10, resultIsPaginated: true })
      );
    });
  });
});
