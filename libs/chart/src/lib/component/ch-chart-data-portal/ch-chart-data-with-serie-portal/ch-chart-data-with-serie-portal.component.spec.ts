import {ComponentFixture, TestBed} from '@angular/core/testing';

import {ChChartDataWithSeriePortalComponent} from './ch-chart-data-with-serie-portal.component';

describe('ChChartDataWithSeriePortalComponent', () => {
  let component: ChChartDataWithSeriePortalComponent;
  let fixture: ComponentFixture<ChChartDataWithSeriePortalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChChartDataWithSeriePortalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChChartDataWithSeriePortalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
