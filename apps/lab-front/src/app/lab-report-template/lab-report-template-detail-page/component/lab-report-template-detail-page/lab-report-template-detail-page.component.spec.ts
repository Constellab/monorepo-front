import {ComponentFixture, TestBed} from '@angular/core/testing';
import {LabReportTemplateDetailPageComponent} from './lab-report-template-detail-page.component';

describe('LabReportTemplateDetailPageComponent', () => {
  let component: LabReportTemplateDetailPageComponent;
  let fixture: ComponentFixture<LabReportTemplateDetailPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LabReportTemplateDetailPageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LabReportTemplateDetailPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
