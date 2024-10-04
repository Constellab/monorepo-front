import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LabNoteSearchComponent } from './lab-note-search.component';

describe('LabNoteSearchComponent', () => {
  let component: LabNoteSearchComponent;
  let fixture: ComponentFixture<LabNoteSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LabNoteSearchComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LabNoteSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
