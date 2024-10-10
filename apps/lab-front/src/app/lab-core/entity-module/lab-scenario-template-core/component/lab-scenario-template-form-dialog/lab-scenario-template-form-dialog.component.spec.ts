import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LabScenarioTemplateFormDialogComponent } from './lab-scenario-template-form-dialog.component';

describe('LabScenarioTemplateFormDialogComponent', () => {
  let component: LabScenarioTemplateFormDialogComponent;
  let fixture: ComponentFixture<LabScenarioTemplateFormDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LabScenarioTemplateFormDialogComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LabScenarioTemplateFormDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
