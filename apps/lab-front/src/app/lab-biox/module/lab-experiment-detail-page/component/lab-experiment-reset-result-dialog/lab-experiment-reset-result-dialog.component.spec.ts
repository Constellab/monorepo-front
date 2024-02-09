import {ComponentFixture, TestBed} from '@angular/core/testing';

import {LabExperimentResetResultDialogComponent} from './lab-experiment-reset-result-dialog.component';

describe('LabExperimentResetResultDialogComponent', () => {
  let component: LabExperimentResetResultDialogComponent;
  let fixture: ComponentFixture<LabExperimentResetResultDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LabExperimentResetResultDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LabExperimentResetResultDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
