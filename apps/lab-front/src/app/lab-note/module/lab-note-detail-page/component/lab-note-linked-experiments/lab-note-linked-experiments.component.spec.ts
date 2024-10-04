import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LabNoteLinkedExperimentsComponent } from './lab-note-linked-experiments.component';

describe('LabNoteAssociatedExperimentsComponent', () => {
  let component: LabNoteLinkedExperimentsComponent;
  let fixture: ComponentFixture<LabNoteLinkedExperimentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LabNoteLinkedExperimentsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LabNoteLinkedExperimentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
