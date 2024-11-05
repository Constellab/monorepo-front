import { Component, OnInit } from '@angular/core';
import { LabNote } from '../../../../model/entities/lab-note.entity';
import { MatDialogRef } from '@angular/material/dialog';

/**
 * Dialog that used the note search to select a note
 */
@Component({
  selector: 'lab-select-note-dialog',
  templateUrl: './lab-select-note-dialog.component.html',
  styleUrls: ['./lab-select-note-dialog.component.scss'],
})
export class LabSelectNoteDialogComponent implements OnInit {
  constructor(private dialogRef: MatDialogRef<LabSelectNoteDialogComponent>) {}

  ngOnInit(): void {}

  onNoteSelected(note: LabNote): void {
    this.dialogRef.close(note);
  }
}
