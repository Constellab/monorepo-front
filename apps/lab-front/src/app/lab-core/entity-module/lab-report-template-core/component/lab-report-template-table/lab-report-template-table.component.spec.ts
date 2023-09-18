import {ComponentFixture, TestBed} from '@angular/core/testing';
import {LabReportTemplateTableComponent} from './lab-report-template-table.component';

describe('LabReportTemplateTableComponent', () => {
  let component: LabReportTemplateTableComponent;
  let fixture: ComponentFixture<LabReportTemplateTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LabReportTemplateTableComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LabReportTemplateTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
