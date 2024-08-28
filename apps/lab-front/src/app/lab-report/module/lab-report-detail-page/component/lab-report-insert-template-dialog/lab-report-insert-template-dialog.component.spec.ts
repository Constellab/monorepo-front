import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LabReportInsertTemplateDialogComponent } from './lab-report-insert-template-dialog.component';

describe('LabReportInsertTemplateDialogComponent', () => {
  let component: LabReportInsertTemplateDialogComponent;
  let fixture: ComponentFixture<LabReportInsertTemplateDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LabReportInsertTemplateDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LabReportInsertTemplateDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
