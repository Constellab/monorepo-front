import { ChangeDetectionStrategy,Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogContent, MatDialogRef } from '@angular/material/dialog';
import { FlDialogModule } from '@monorepo/front-core-lib/fl-dialog';
import { LiNote, LiNoteSearchFields, LiNoteSearchFieldsDisabled } from '@monorepo/lab-lib/li-core';
import { TranslatePipe } from '@ngx-translate/core';

import { LiNoteSearchComponent } from '../li-note-search/li-note-search.component';

export interface LiSelectNoteDialogInput {
  mode?: 'selection' | 'link';
  title?: string;
  defaultFilters?: Partial<LiNoteSearchFields>;
  disabledFilters?: LiNoteSearchFieldsDisabled;
}

/**
 * Dialog that used the note search to select a note
 */
@Component({
  selector: 'li-select-note-dialog',
  templateUrl: './li-select-note-dialog.component.html',
  styleUrls: ['./li-select-note-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [FlDialogModule, MatDialogContent, LiNoteSearchComponent, TranslatePipe],
})
export class LiSelectNoteDialogComponent {
  private dialogRef = inject<MatDialogRef<LiSelectNoteDialogComponent>>(MatDialogRef);

  title: string;
  noteSelectable: boolean;
  defaultFilters: Partial<LiNoteSearchFields>;
  disabledFilters: LiNoteSearchFieldsDisabled;

  constructor() {
    const data = inject<LiSelectNoteDialogInput>(MAT_DIALOG_DATA, { optional: true });
    this.title = data?.title ?? 'li.note_select';
    this.noteSelectable = data?.mode !== 'link';
    this.defaultFilters = data?.defaultFilters;
    this.disabledFilters = data?.disabledFilters;
  }

  onNoteSelected(note: LiNote): void {
    this.dialogRef.close(note);
  }
}
