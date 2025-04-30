import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CaScenarioTechnicalReportIntOutComponent } from './ca-scenario-technical-report-int-out.component';

describe('CaScenarioTechnicalReportIntOutComponent', () => {
  let component: CaScenarioTechnicalReportIntOutComponent;
  let fixture: ComponentFixture<CaScenarioTechnicalReportIntOutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CaScenarioTechnicalReportIntOutComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CaScenarioTechnicalReportIntOutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
