import {ComponentFixture, TestBed} from '@angular/core/testing';
import {LabReportInlineComponent} from './lab-report-inline.component';

describe('LabReportInlineComponent', () => {
  let component: LabReportInlineComponent;
  let fixture: ComponentFixture<LabReportInlineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LabReportInlineComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LabReportInlineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
