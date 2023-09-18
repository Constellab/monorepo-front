import {ComponentFixture, TestBed} from '@angular/core/testing';
import {LabSelectReportTemplateDialogComponent} from './lab-select-report-template-dialog.component';

describe('LabSelectReportTemplateDialogComponent', () => {
  let component: LabSelectReportTemplateDialogComponent;
  let fixture: ComponentFixture<LabSelectReportTemplateDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LabSelectReportTemplateDialogComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LabSelectReportTemplateDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
