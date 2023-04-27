import {ComponentFixture, TestBed} from '@angular/core/testing';

import {ChChartBinDataPortalComponent} from './ch-chart-bin-data-portal.component';

describe('ChChartBinDataPortalComponent', () => {
  let component: ChChartBinDataPortalComponent;
  let fixture: ComponentFixture<ChChartBinDataPortalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChChartBinDataPortalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChChartBinDataPortalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
