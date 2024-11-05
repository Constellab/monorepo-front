import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChChartLegendMultiSeriesComponent } from './ch-chart-legend-multi-series.component';

describe('ChChartLegendMultiSeriesComponent', () => {
  let component: ChChartLegendMultiSeriesComponent;
  let fixture: ComponentFixture<ChChartLegendMultiSeriesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ChChartLegendMultiSeriesComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChChartLegendMultiSeriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
