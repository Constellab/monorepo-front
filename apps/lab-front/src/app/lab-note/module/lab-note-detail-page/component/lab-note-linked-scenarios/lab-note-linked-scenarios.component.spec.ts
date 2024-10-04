import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LabNoteLinkedScenariosComponent } from './lab-note-linked-scenarios.component';

describe('LabNoteAssociatedScenariosComponent', () => {
  let component: LabNoteLinkedScenariosComponent;
  let fixture: ComponentFixture<LabNoteLinkedScenariosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LabNoteLinkedScenariosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LabNoteLinkedScenariosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
