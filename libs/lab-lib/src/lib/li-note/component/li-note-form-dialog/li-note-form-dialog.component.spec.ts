import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LiNoteFormDialogComponent } from './li-note-form-dialog.component';

describe('LiNoteFormDialogComponent', () => {
  let component: LiNoteFormDialogComponent;
  let fixture: ComponentFixture<LiNoteFormDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LiNoteFormDialogComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LiNoteFormDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
