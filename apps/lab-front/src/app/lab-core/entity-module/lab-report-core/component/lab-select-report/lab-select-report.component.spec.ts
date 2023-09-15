import {ComponentFixture, TestBed} from '@angular/core/testing';
import {LabSelectReportComponent} from './lab-select-report.component';

describe('LabSelectReportComponent', () => {
  let component: LabSelectReportComponent;
  let fixture: ComponentFixture<LabSelectReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LabSelectReportComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LabSelectReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
