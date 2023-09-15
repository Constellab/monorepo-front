import {ComponentFixture, TestBed} from '@angular/core/testing';
import {LabReportTemplateInlineComponent} from './lab-report-template-inline.component';

describe('LabReportTemplateInlineComponent', () => {
  let component: LabReportTemplateInlineComponent;
  let fixture: ComponentFixture<LabReportTemplateInlineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LabReportTemplateInlineComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LabReportTemplateInlineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
