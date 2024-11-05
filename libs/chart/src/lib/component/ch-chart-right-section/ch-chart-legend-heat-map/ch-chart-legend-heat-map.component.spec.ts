import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChChartLegendHeatMapComponent } from './ch-chart-legend-heat-map.component';

describe('ChChartLegendHeatMapComponent', () => {
  let component: ChChartLegendHeatMapComponent;
  let fixture: ComponentFixture<ChChartLegendHeatMapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ChChartLegendHeatMapComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChChartLegendHeatMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
