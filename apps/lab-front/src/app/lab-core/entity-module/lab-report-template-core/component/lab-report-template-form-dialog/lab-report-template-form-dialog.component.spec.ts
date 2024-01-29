import {ComponentFixture, TestBed} from '@angular/core/testing';
import {LabReportTemplateFormDialogComponent} from './lab-report-template-form-dialog.component';

describe('LabReportTemplateFormDialogComponent', () => {
  let component: LabReportTemplateFormDialogComponent;
  let fixture: ComponentFixture<LabReportTemplateFormDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LabReportTemplateFormDialogComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LabReportTemplateFormDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
