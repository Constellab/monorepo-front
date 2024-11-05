import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChChartHeatMapDataPortalComponent } from './ch-chart-heat-map-data-portal.component';

describe('ChChartHeatMapDataPortalComponent', () => {
  let component: ChChartHeatMapDataPortalComponent;
  let fixture: ComponentFixture<ChChartHeatMapDataPortalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ChChartHeatMapDataPortalComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChChartHeatMapDataPortalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
