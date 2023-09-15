import {ComponentFixture, TestBed} from '@angular/core/testing';
import {LabSelectReportTemplateComponent} from './lab-select-report-template.component';

describe('LabSelectReportTemplateComponent', () => {
  let component: LabSelectReportTemplateComponent;
  let fixture: ComponentFixture<LabSelectReportTemplateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LabSelectReportTemplateComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LabSelectReportTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
