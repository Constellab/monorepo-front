import {ComponentFixture, TestBed} from '@angular/core/testing';
import {LabSelectReportDynamicFieldComponent} from './lab-select-report-dynamic-field.component';

describe('LabSelectReportDynamicFieldComponent', () => {
  let component: LabSelectReportDynamicFieldComponent;
  let fixture: ComponentFixture<LabSelectReportDynamicFieldComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LabSelectReportDynamicFieldComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LabSelectReportDynamicFieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
