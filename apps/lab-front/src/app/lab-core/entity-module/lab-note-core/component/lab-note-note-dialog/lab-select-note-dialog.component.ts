import { Component, inject, OnInit } from '@angular/core';
import { LabNote } from '../../../../model/entities/lab-note.entity';
import { MatDialogContent, MatDialogRef } from '@angular/material/dialog';
import { FlDialogModule } from '@monorepo/front-core-lib/fl-dialog';
import { LabNoteSearchComponent } from '../lab-note-search/lab-note-search.component';
import { TranslatePipe } from '@ngx-translate/core';

/**
 * Dialog that used the note search to select a note
 */
@Component({
  selector: 'lab-select-note-dialog',
  templateUrl: './lab-select-note-dialog.component.html',
  styleUrls: ['./lab-select-note-dialog.component.scss'],
  imports: [FlDialogModule, MatDialogContent, LabNoteSearchComponent, TranslatePipe],
})
export class LabSelectNoteDialogComponent implements OnInit {
  private dialogRef = inject<MatDialogRef<LabSelectNoteDialogComponent>>(MatDialogRef);

  ngOnInit(): void {}

  onNoteSelected(note: LabNote): void {
    this.dialogRef.close(note);
  }
}
