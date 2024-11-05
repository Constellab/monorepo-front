import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LabScenarioTemplateWorkflowComponent } from './lab-scenario-template-workflow.component';

describe('LabScenarioTemplateWorkflowComponent', () => {
  let component: LabScenarioTemplateWorkflowComponent;
  let fixture: ComponentFixture<LabScenarioTemplateWorkflowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LabScenarioTemplateWorkflowComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LabScenarioTemplateWorkflowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
