import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LabSelectScenarioTemplateComponent } from './lab-select-scenario-template.component';

describe('LabSelectScenarioTemplateComponent', () => {
  let component: LabSelectScenarioTemplateComponent;
  let fixture: ComponentFixture<LabSelectScenarioTemplateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LabSelectScenarioTemplateComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LabSelectScenarioTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
