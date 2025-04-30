import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CaLabDashboardPageComponent } from './ca-lab-dashboard-page.component';

describe('CaLabDashboardPageComponent', () => {
  let component: CaLabDashboardPageComponent;
  let fixture: ComponentFixture<CaLabDashboardPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CaLabDashboardPageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CaLabDashboardPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
