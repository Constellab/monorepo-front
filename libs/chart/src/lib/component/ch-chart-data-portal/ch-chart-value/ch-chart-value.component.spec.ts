import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChChartValueComponent } from './ch-chart-value.component';

describe('ChChartValueComponent', () => {
  let component: ChChartValueComponent;
  let fixture: ComponentFixture<ChChartValueComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ChChartValueComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ChChartValueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
