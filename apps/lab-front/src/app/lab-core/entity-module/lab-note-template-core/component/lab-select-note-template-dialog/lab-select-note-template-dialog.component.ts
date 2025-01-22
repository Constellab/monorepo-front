import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogContent } from '@angular/material/dialog';
import { LabNoteTemplate } from '../../../../model/entities/lab-note-template.entity';
import { FlDialogModule } from '../../../../../../../../../libs/front-core-lib/src/lib/module/fl-dialog/fl-dialog.module';
import { CdkScrollable } from '@angular/cdk/scrolling';
import { LabNoteTemplateSearchComponent } from '../lab-note-template-search/lab-note-template-search.component';
import { TranslatePipe } from '@ngx-translate/core';

export interface LabSelectNoteTemplateDialogInput {
  mode: 'selection' | 'link';
}

@Component({
  selector: 'lab-select-note-template-dialog',
  templateUrl: './lab-select-note-template-dialog.component.html',
  styleUrls: ['./lab-select-note-template-dialog.component.scss'],
  imports: [FlDialogModule, CdkScrollable, MatDialogContent, LabNoteTemplateSearchComponent, TranslatePipe],
})
export class LabSelectNoteTemplateDialogComponent {
  private dialogRef = inject<MatDialogRef<LabSelectNoteTemplateDialogComponent>>(MatDialogRef);

  rowSelectable: boolean;

  constructor() {
    const input = inject<LabSelectNoteTemplateDialogInput>(MAT_DIALOG_DATA);

    this.rowSelectable = input.mode === 'selection';
  }

  onTemplateSelected(template: LabNoteTemplate): void {
    this.dialogRef.close(template);
  }
}
