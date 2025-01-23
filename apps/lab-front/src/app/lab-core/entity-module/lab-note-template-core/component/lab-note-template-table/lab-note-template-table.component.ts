import { Component, EventEmitter, Input, Output } from '@angular/core';
import {
  LabNoteTemplate,
  LabNoteTemplateDatasource,
} from '../../../../model/entities/lab-note-template.entity';
import { FlTableColumnStatic } from '@monorepo/front-core-lib/fl-core';
import {
  MatTable,
  MatColumnDef,
  MatHeaderCellDef,
  MatHeaderCell,
  MatCellDef,
  MatCell,
  MatHeaderRowDef,
  MatHeaderRow,
  MatRowDef,
  MatRow,
} from '@angular/material/table';
import { MatSort, MatSortHeader } from '@angular/material/sort';
import { FlSearchModule } from '@monorepo/front-core-lib/fl-search';
import { RouterLink } from '@angular/router';
import { FlUserModule } from '@monorepo/front-core-lib/fl-user';
import { TranslatePipe } from '@ngx-translate/core';
import { LabDetailRoutePipe } from '../../../../lab-core-pipe/lab-detail-route/lab-detail-route.pipe';

@Component({
  selector: 'lab-note-template-table',
  templateUrl: './lab-note-template-table.component.html',
  styleUrls: ['./lab-note-template-table.component.scss'],
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
    LabDetailRoutePipe,
  ],
})
export class LabNoteTemplateTableComponent {
  // when true, the row become clickable and resourceSelected event is trigger
  @Input() rowSelectable: boolean = false;

  @Input({ required: true }) datasource: LabNoteTemplateDatasource<any>;

  @Input() columns: FlTableColumnStatic<LabNoteTemplate>[] = ['title', 'creation', 'lastModification'];

  @Output() noteTemplateSelected: EventEmitter<LabNoteTemplate> = new EventEmitter();

  rowClicked(noteTemplate: LabNoteTemplate): void {
    if (this.rowSelectable) {
      this.noteTemplateSelected.next(noteTemplate);
    }
  }
}
