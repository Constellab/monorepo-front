import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LabSelectNoteDialogComponent } from './lab-select-note-dialog.component';

describe('LabSelectNoteDialogComponent', () => {
  let component: LabSelectNoteDialogComponent;
  let fixture: ComponentFixture<LabSelectNoteDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LabSelectNoteDialogComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LabSelectNoteDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
