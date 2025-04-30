import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CaScenarioTechnicalReportComponent } from './ca-scenario-technical-report.component';

describe('CaScenarioTechnicalReportComponent', () => {
  let component: CaScenarioTechnicalReportComponent;
  let fixture: ComponentFixture<CaScenarioTechnicalReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CaScenarioTechnicalReportComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CaScenarioTechnicalReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
