import {ComponentFixture, TestBed} from '@angular/core/testing';

import {LabExperimentLinkedReportsComponent} from './lab-experiment-linked-reports.component';

describe('LabExperimentAssociatedReportsComponent', () => {
  let component: LabExperimentLinkedReportsComponent;
  let fixture: ComponentFixture<LabExperimentLinkedReportsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LabExperimentLinkedReportsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LabExperimentLinkedReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
