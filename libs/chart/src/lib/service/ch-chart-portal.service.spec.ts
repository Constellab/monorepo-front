import { TestBed } from '@angular/core/testing';

import { ChChartPortalService } from './ch-chart-portal.service';

describe('ChChartPortalService', () => {
  let service: ChChartPortalService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ChChartPortalService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
