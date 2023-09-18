import {ComponentFixture, TestBed} from '@angular/core/testing';
import {LabReportTemplateSearchFormComponent} from './lab-report-template-search-form.component';

describe('LabReportTemplateSearchFormComponent', () => {
  let component: LabReportTemplateSearchFormComponent;
  let fixture: ComponentFixture<LabReportTemplateSearchFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LabReportTemplateSearchFormComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LabReportTemplateSearchFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
