import {ComponentFixture, TestBed} from '@angular/core/testing';

import {ChChartStackedBarDataPortalComponent} from './ch-chart-stacked-bar-data-portal.component';

describe('ChChartStackedBarDataPortalComponent', () => {
  let component: ChChartStackedBarDataPortalComponent;
  let fixture: ComponentFixture<ChChartStackedBarDataPortalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChChartStackedBarDataPortalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChChartStackedBarDataPortalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
