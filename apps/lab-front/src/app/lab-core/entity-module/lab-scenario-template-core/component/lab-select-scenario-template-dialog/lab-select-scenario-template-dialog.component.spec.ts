import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LabSelectScenarioTemplateDialogComponent } from './lab-select-scenario-template-dialog.component';

describe('LabSelectScenarioTemplateDialogComponent', () => {
  let component: LabSelectScenarioTemplateDialogComponent;
  let fixture: ComponentFixture<LabSelectScenarioTemplateDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LabSelectScenarioTemplateDialogComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LabSelectScenarioTemplateDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
