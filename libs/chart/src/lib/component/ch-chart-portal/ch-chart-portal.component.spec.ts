import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChChartPortalComponent } from './ch-chart-portal.component';

describe('ChChartDynamicPortalComponent', () => {
  let component: ChChartPortalComponent;
  let fixture: ComponentFixture<ChChartPortalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ChChartPortalComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChChartPortalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
