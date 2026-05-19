import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogContent, MatDialogRef } from '@angular/material/dialog';
import { FlDialogModule } from '@monorepo/front-core-lib/fl-dialog';
import {
  LiNoteTemplate,
  LiNoteTemplateSearchFields,
  LiNoteTemplateSearchFieldsDisabled,
} from '@monorepo/lab-lib/li-core';
import { TranslatePipe } from '@ngx-translate/core';

import { LiNoteTemplateSearchComponent } from '../li-note-template-search/li-note-template-search.component';

export interface LiSelectNoteTemplateDialogInput {
  mode: 'selection' | 'link';
  title?: string;
  defaultFilters?: Partial<LiNoteTemplateSearchFields>;
  disabledFilters?: LiNoteTemplateSearchFieldsDisabled;
}

@Component({
  selector: 'li-select-note-template-dialog',
  templateUrl: './li-select-note-template-dialog.component.html',
  styleUrls: ['./li-select-note-template-dialog.component.scss'],
  imports: [FlDialogModule, MatDialogContent, LiNoteTemplateSearchComponent, TranslatePipe],
})
export class LiSelectNoteTemplateDialogComponent {
  private dialogRef = inject<MatDialogRef<LiSelectNoteTemplateDialogComponent>>(MatDialogRef);

  title: string;
  rowSelectable: boolean;
  defaultFilters: Partial<LiNoteTemplateSearchFields>;
  disabledFilters: LiNoteTemplateSearchFieldsDisabled;

  constructor() {
    const input = inject<LiSelectNoteTemplateDialogInput>(MAT_DIALOG_DATA);

    this.title = input?.title ?? 'li.select_note_template';
    this.rowSelectable = input.mode === 'selection';
    this.defaultFilters = input?.defaultFilters;
    this.disabledFilters = input?.disabledFilters;
  }

  onTemplateSelected(template: LiNoteTemplate): void {
    this.dialogRef.close(template);
  }
}
