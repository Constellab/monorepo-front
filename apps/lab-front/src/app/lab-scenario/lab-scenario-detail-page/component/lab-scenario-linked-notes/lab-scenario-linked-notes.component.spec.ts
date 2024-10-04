import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LabScenarioLinkedNotesComponent } from './lab-scenario-linked-notes.component';

describe('LabScenarioAssociatedNotesComponent', () => {
  let component: LabScenarioLinkedNotesComponent;
  let fixture: ComponentFixture<LabScenarioLinkedNotesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LabScenarioLinkedNotesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LabScenarioLinkedNotesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
