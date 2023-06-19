import {ComponentFixture, TestBed} from '@angular/core/testing';

import {RvViewPlotlyComponent} from './rv-view-plotly.component';

describe('RvViewPlotlyComponent', () => {
  let component: RvViewPlotlyComponent;
  let fixture: ComponentFixture<RvViewPlotlyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RvViewPlotlyComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(RvViewPlotlyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
