import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CaScenarioTechnicalReportLinkComponent } from './ca-scenario-technical-report-link.component';

describe('CaScenarioTechnicalReportLinkComponent', () => {
  let component: CaScenarioTechnicalReportLinkComponent;
  let fixture: ComponentFixture<CaScenarioTechnicalReportLinkComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CaScenarioTechnicalReportLinkComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CaScenarioTechnicalReportLinkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
