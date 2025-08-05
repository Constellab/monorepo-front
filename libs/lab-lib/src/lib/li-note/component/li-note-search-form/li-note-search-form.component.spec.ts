import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LiNoteSearchFormComponent } from './li-note-search-form.component';

describe('LabNoteAdvancedSearchFormComponent', () => {
  let component: LiNoteSearchFormComponent;
  let fixture: ComponentFixture<LiNoteSearchFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LiNoteSearchFormComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LiNoteSearchFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
