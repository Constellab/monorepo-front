import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LabSelectScenarioDialogComponent } from './lab-select-scenario-dialog.component';

describe('LabSelectScenarioDialogComponent', () => {
  let component: LabSelectScenarioDialogComponent;
  let fixture: ComponentFixture<LabSelectScenarioDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LabSelectScenarioDialogComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LabSelectScenarioDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
