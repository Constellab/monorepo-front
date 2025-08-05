import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatSort, MatSortHeader } from '@angular/material/sort';
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell,
  MatHeaderCellDef,
  MatHeaderRow,
  MatHeaderRowDef,
  MatRow,
  MatRowDef,
  MatTable,
} from '@angular/material/table';
import { RouterLink } from '@angular/router';
import { FlTableColumnStatic } from '@monorepo/front-core-lib/fl-core';
import { FlSearchModule } from '@monorepo/front-core-lib/fl-search';
import { FlUserModule } from '@monorepo/front-core-lib/fl-user';
import { LiDetailRoutePipe, LiNoteTemplate, LiNoteTemplateDatasource } from '@monorepo/lab-lib/li-core';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'li-note-template-table',
  templateUrl: './li-note-template-table.component.html',
  styleUrls: ['./li-note-template-table.component.scss'],
  imports: [
    MatTable,
    MatSort,
    FlSearchModule,
    MatColumnDef,
    MatHeaderCellDef,
    MatHeaderCell,
    MatSortHeader,
    MatCellDef,
    MatCell,
    RouterLink,
    FlUserModule,
    MatHeaderRowDef,
    MatHeaderRow,
    MatRowDef,
    MatRow,
    TranslatePipe,
    LiDetailRoutePipe,
  ],
})
export class LiNoteTemplateTableComponent {
  // when true, the row become clickable and resourceSelected event is trigger
  @Input() rowSelectable: boolean = false;

  @Input({ required: true }) datasource: LiNoteTemplateDatasource<any>;

  @Input() columns: FlTableColumnStatic<LiNoteTemplate>[] = ['title', 'creation', 'lastModification'];

  @Output() noteTemplateSelected: EventEmitter<LiNoteTemplate> = new EventEmitter();

  rowClicked(noteTemplate: LiNoteTemplate): void {
    if (this.rowSelectable) {
      this.noteTemplateSelected.next(noteTemplate);
    }
  }
}
