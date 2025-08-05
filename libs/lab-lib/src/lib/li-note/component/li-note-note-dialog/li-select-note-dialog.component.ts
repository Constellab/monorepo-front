import { Component, inject,OnInit } from '@angular/core';
import { MatDialogContent, MatDialogRef } from '@angular/material/dialog';
import { FlDialogModule } from '@monorepo/front-core-lib/fl-dialog';
import { LiNote } from '@monorepo/lab-lib/li-core';
import { TranslatePipe } from '@ngx-translate/core';

import { LiNoteSearchComponent } from '../li-note-search/li-note-search.component';

/**
 * Dialog that used the note search to select a note
 */
@Component({
  selector: 'li-select-note-dialog',
  templateUrl: './li-select-note-dialog.component.html',
  styleUrls: ['./li-select-note-dialog.component.scss'],
  imports: [FlDialogModule, MatDialogContent, LiNoteSearchComponent, TranslatePipe],
})
export class LiSelectNoteDialogComponent {
  private dialogRef = inject<MatDialogRef<LiSelectNoteDialogComponent>>(MatDialogRef);

  onNoteSelected(note: LiNote): void {
    this.dialogRef.close(note);
  }
}
