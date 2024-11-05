import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChChartSerieInlineComponent } from './ch-chart-serie-inline.component';

describe('ChChartSerieInlineComponent', () => {
  let component: ChChartSerieInlineComponent;
  let fixture: ComponentFixture<ChChartSerieInlineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ChChartSerieInlineComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChChartSerieInlineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
