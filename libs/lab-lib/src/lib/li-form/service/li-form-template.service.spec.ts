import { TestBed } from '@angular/core/testing';
import { FlApiService } from '@monorepo/front-core-lib/fl-api';
import { of } from 'rxjs';

import { LiFormTemplate } from '../../li-core/model/entities/form/li-form-template.entity';
import { LiFormTemplateVersion } from '../../li-core/model/entities/form/li-form-template-version.entity';
import { LiFormTemplateService } from './li-form-template.service';

describe('LiFormTemplateService', () => {
  let service: LiFormTemplateService;
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
      providers: [LiFormTemplateService, { provide: FlApiService, useValue: apiServiceSpy }],
    });
    service = TestBed.inject(LiFormTemplateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('create', () => {
    it('should POST to form-template', () => {
      const dto = { name: 'Test Template' };
      service.create(dto);
      expect(apiServiceSpy.post).toHaveBeenCalledWith('form-template', dto, LiFormTemplate);
    });
  });

  describe('getById', () => {
    it('should GET form-template/{id}', () => {
      service.getById('abc-123');
      expect(apiServiceSpy.get).toHaveBeenCalledWith('form-template/abc-123', LiFormTemplate);
    });
  });

  describe('update', () => {
    it('should PUT form-template/{id}', () => {
      const dto = { name: 'Updated' };
      service.update('abc-123', dto);
      expect(apiServiceSpy.put).toHaveBeenCalledWith('form-template/abc-123', dto, LiFormTemplate);
    });
  });

  describe('delete', () => {
    it('should DELETE form-template/{id}', () => {
      service.delete('abc-123');
      expect(apiServiceSpy.delete).toHaveBeenCalledWith('form-template/abc-123');
    });
  });

  describe('search', () => {
    it('should POST to form-template/search with pagination', () => {
      const data = { filters: {}, sorts: [] } as any;
      service.search(0, 20, data);
      expect(apiServiceSpy.post).toHaveBeenCalledWith(
        'form-template/search',
        expect.any(Object),
        LiFormTemplate,
        expect.objectContaining({ page: 0, pageSize: 20, resultIsPaginated: true })
      );
    });
  });

  describe('archive', () => {
    it('should PUT form-template/{id}/archive', () => {
      service.archive('abc-123');
      expect(apiServiceSpy.put).toHaveBeenCalledWith('form-template/abc-123/archive', null, LiFormTemplate);
    });
  });

  describe('unarchive', () => {
    it('should PUT form-template/{id}/unarchive', () => {
      service.unarchive('abc-123');
      expect(apiServiceSpy.put).toHaveBeenCalledWith('form-template/abc-123/unarchive', null, LiFormTemplate);
    });
  });

  describe('createVersion', () => {
    it('should POST to form-template/{templateId}/version', () => {
      const dto = { copy_from_version_id: 'v1' };
      service.createVersion('tmpl-1', dto);
      expect(apiServiceSpy.post).toHaveBeenCalledWith(
        'form-template/tmpl-1/version',
        dto,
        LiFormTemplateVersion
      );
    });
  });

  describe('getVersion', () => {
    it('should GET form-template/{templateId}/version/{versionId}', () => {
      service.getVersion('tmpl-1', 'ver-1');
      expect(apiServiceSpy.get).toHaveBeenCalledWith(
        'form-template/tmpl-1/version/ver-1',
        LiFormTemplateVersion
      );
    });
  });

  describe('updateVersion', () => {
    it('should PUT form-template/{templateId}/version/{versionId}', () => {
      const dto = { content: { specs: [] } };
      service.updateVersion('tmpl-1', 'ver-1', dto);
      expect(apiServiceSpy.put).toHaveBeenCalledWith(
        'form-template/tmpl-1/version/ver-1',
        dto,
        LiFormTemplateVersion
      );
    });
  });

  describe('deleteVersion', () => {
    it('should DELETE form-template/{templateId}/version/{versionId}', () => {
      service.deleteVersion('tmpl-1', 'ver-1');
      expect(apiServiceSpy.delete).toHaveBeenCalledWith('form-template/tmpl-1/version/ver-1');
    });
  });

  describe('publishVersion', () => {
    it('should POST to form-template/{templateId}/version/{versionId}/publish', () => {
      service.publishVersion('tmpl-1', 'ver-1');
      expect(apiServiceSpy.post).toHaveBeenCalledWith(
        'form-template/tmpl-1/version/ver-1/publish',
        null,
        LiFormTemplateVersion
      );
    });
  });

  describe('archiveVersion', () => {
    it('should POST to form-template/{templateId}/version/{versionId}/archive', () => {
      service.archiveVersion('tmpl-1', 'ver-1');
      expect(apiServiceSpy.post).toHaveBeenCalledWith(
        'form-template/tmpl-1/version/ver-1/archive',
        null,
        LiFormTemplateVersion
      );
    });
  });
});
