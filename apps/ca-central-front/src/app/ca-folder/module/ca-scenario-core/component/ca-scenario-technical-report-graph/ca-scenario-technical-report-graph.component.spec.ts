import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CaScenarioTechnicalReportGraphComponent } from './ca-scenario-technical-report-graph.component';

describe('CaScenarioTechnicalReportGraphComponent', () => {
  let component: CaScenarioTechnicalReportGraphComponent;
  let fixture: ComponentFixture<CaScenarioTechnicalReportGraphComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CaScenarioTechnicalReportGraphComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CaScenarioTechnicalReportGraphComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
