import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LabExperimentLinkedNotesComponent } from './lab-experiment-linked-notes.component';

describe('LabExperimentAssociatedNotesComponent', () => {
  let component: LabExperimentLinkedNotesComponent;
  let fixture: ComponentFixture<LabExperimentLinkedNotesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LabExperimentLinkedNotesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LabExperimentLinkedNotesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
