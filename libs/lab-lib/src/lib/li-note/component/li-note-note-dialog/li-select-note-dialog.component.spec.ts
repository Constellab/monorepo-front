import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LiSelectNoteDialogComponent } from './li-select-note-dialog.component';

describe('LiSelectNoteDialogComponent', () => {
  let component: LiSelectNoteDialogComponent;
  let fixture: ComponentFixture<LiSelectNoteDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LiSelectNoteDialogComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LiSelectNoteDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
