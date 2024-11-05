import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChChartTypeSelectOptionsComponent } from './ch-chart-type-select-options.component';

describe('ChChartComponentSelectOptionsComponent', () => {
  let component: ChChartTypeSelectOptionsComponent;
  let fixture: ComponentFixture<ChChartTypeSelectOptionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ChChartTypeSelectOptionsComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChChartTypeSelectOptionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
