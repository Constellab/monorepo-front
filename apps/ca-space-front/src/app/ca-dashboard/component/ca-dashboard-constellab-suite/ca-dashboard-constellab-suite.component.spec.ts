import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CaDashboardConstellabSuiteComponent } from './ca-dashboard-constellab-suite.component';

describe('CaDashboardConstellabSuiteComponent', () => {
  let component: CaDashboardConstellabSuiteComponent;
  let fixture: ComponentFixture<CaDashboardConstellabSuiteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CaDashboardConstellabSuiteComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CaDashboardConstellabSuiteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
