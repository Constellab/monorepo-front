import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LabNoteSearchFormComponent } from './lab-note-search-form.component';

describe('LabNoteAdvancedSearchFormComponent', () => {
  let component: LabNoteSearchFormComponent;
  let fixture: ComponentFixture<LabNoteSearchFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LabNoteSearchFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LabNoteSearchFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
