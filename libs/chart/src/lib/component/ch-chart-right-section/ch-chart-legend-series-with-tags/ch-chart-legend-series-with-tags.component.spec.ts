import {ComponentFixture, TestBed} from '@angular/core/testing';

import {ChChartLegendSeriesWithTagsComponent} from './ch-chart-legend-series-with-tags.component';

describe('ChChartLegendSeriesWithTagsComponent', () => {
  let component: ChChartLegendSeriesWithTagsComponent;
  let fixture: ComponentFixture<ChChartLegendSeriesWithTagsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChChartLegendSeriesWithTagsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChChartLegendSeriesWithTagsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
