import {ComponentFixture, TestBed} from '@angular/core/testing';
import {LabReportTemplateSearchComponent} from './lab-report-template-search.component';

describe('LabReportTemplateSearchComponent', () => {
  let component: LabReportTemplateSearchComponent;
  let fixture: ComponentFixture<LabReportTemplateSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LabReportTemplateSearchComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LabReportTemplateSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
