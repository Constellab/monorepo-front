import {ComponentFixture, TestBed} from '@angular/core/testing';
import {LabSelectReportTemplateDynamicFieldComponent} from './lab-select-report-template-dynamic-field.component';

describe('LabSelectReportTemplateDynamicFieldComponent', () => {
  let component: LabSelectReportTemplateDynamicFieldComponent;
  let fixture: ComponentFixture<LabSelectReportTemplateDynamicFieldComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LabSelectReportTemplateDynamicFieldComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(
      LabSelectReportTemplateDynamicFieldComponent
    );
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
