import {ComponentFixture, TestBed} from '@angular/core/testing';

import {ChChartComponent} from './ch-chart.component';

describe('ChChartDynamicComponent', () => {
  let component: ChChartComponent;
  let fixture: ComponentFixture<ChChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChChartComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
