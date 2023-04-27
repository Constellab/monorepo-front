import {ComponentFixture, TestBed} from '@angular/core/testing';

import {ChChartBoxPlotDataPortalComponent} from './ch-chart-box-plot-data-portal.component';

describe('ChChartBoxPlotDataPortalComponent', () => {
  let component: ChChartBoxPlotDataPortalComponent;
  let fixture: ComponentFixture<ChChartBoxPlotDataPortalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChChartBoxPlotDataPortalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChChartBoxPlotDataPortalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
