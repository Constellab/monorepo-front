import {ComponentFixture, TestBed} from '@angular/core/testing';

import {LabReportSearchFormComponent} from './lab-report-search-form.component';

describe('LabReportAdvancedSearchFormComponent', () => {
  let component: LabReportSearchFormComponent;
  let fixture: ComponentFixture<LabReportSearchFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LabReportSearchFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LabReportSearchFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
