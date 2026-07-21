import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy,Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogContent } from '@angular/material/dialog';
import { FlArrayObs } from '@monorepo/front-core-lib/fl-core';
import { FlDialogModule } from '@monorepo/front-core-lib/fl-dialog';
import {
  FlTranslatableText,
  FlTranslateModule,
} from '@monorepo/front-core-lib/fl-translate';

import { CaNote } from '../../../../../ca-core/model/entities/folder/ca-note.class';
import { CaNoteTableComponent } from '../ca-note-table/ca-note-table.component';

export interface CaNoteTableDialogInput {
  notes: FlArrayObs<CaNote>;
  title: FlTranslatableText;
}

@Component({
  selector: 'ca-note-table-dialog',
  imports: [FlDialogModule, FlTranslateModule, MatDialogContent, CaNoteTableComponent, AsyncPipe],
  templateUrl: './ca-note-table-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './ca-note-table-dialog.component.scss',
})
export class CaNoteTableDialogComponent {
  data = inject<CaNoteTableDialogInput>(MAT_DIALOG_DATA);
}
