import { LiVenvService } from './li-venv.service';
import { TestBed } from '@angular/core/testing';

describe('LiVenvService', () => {
  let service: LiVenvService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LiVenvService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
