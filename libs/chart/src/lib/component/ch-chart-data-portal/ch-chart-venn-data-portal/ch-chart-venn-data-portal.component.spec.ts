import {ComponentFixture, TestBed} from '@angular/core/testing';

import {ChChartVennDataPortalComponent} from './ch-chart-venn-data-portal.component';

describe('ChChartVennDataPortalComponent', () => {
  let component: ChChartVennDataPortalComponent;
  let fixture: ComponentFixture<ChChartVennDataPortalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChChartVennDataPortalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChChartVennDataPortalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
