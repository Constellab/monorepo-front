import { TestBed } from '@angular/core/testing';

import { LiTypeService } from './li-type.service';

describe('LiTypeService', () => {
  let service: LiTypeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LiTypeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
