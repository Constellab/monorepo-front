import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LabScenarioFormDialogComponent } from './lab-scenario-form-dialog.component';

describe('BioxScenarioFormDialogComponent', () => {
  let component: LabScenarioFormDialogComponent;
  let fixture: ComponentFixture<LabScenarioFormDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LabScenarioFormDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LabScenarioFormDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
