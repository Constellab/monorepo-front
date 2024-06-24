import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FlPlotlyStandaloneComponent } from './fl-plotly-standalone.component';

describe('FlPlotlyStandaloneComponent', () => {
  let component: FlPlotlyStandaloneComponent;
  let fixture: ComponentFixture<FlPlotlyStandaloneComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FlPlotlyStandaloneComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FlPlotlyStandaloneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
