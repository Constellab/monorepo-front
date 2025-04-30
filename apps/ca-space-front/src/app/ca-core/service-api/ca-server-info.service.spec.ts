import { TestBed } from '@angular/core/testing';

import { CaServerService } from './ca-server.service';

describe('serverService', () => {
  let service: CaServerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CaServerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
