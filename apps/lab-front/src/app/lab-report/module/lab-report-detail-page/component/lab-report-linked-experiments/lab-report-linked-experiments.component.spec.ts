import {ComponentFixture, TestBed} from '@angular/core/testing';

import {LabReportLinkedExperimentsComponent} from './lab-report-linked-experiments.component';

describe('LabReportAssociatedExperimentsComponent', () => {
  let component: LabReportLinkedExperimentsComponent;
  let fixture: ComponentFixture<LabReportLinkedExperimentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LabReportLinkedExperimentsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LabReportLinkedExperimentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
