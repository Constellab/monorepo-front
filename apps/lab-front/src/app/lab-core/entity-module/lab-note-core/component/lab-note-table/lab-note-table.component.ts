import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FlDatasource, FlTableColumnStatic } from '@monorepo/front-core-lib';
import { LabNote } from '../../../../model/entities/lab-note.entity';
import { ClHelpService } from '@monorepo/core-lib';
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
import { FlSearchModule } from '../../../../../../../../../libs/front-core-lib/src/lib/module/fl-search/fl-search.module';
import { RouterLink } from '@angular/router';
import { FlTextIconModule } from '../../../../../../../../../libs/front-core-lib/src/lib/module/fl-text-icon/fl-text-icon.module';
import { MatIcon } from '@angular/material/icon';
import { FlIconModule } from '../../../../../../../../../libs/front-core-lib/src/lib/module/fl-svg-icon/fl-icon.module';
import { MatTooltip } from '@angular/material/tooltip';
import { LabTagListComponent } from '../../../lab-tag-core/component/lab-tag-list/lab-tag-list.component';
import { FlUserModule } from '../../../../../../../../../libs/front-core-lib/src/lib/module/fl-user/fl-user.module';
import { MatIconButton } from '@angular/material/button';
import { TranslatePipe } from '@ngx-translate/core';
import { FlColorModule } from '../../../../../../../../../libs/front-core-lib/src/lib/module/fl-color/fl-color.module';
import { LabDetailRoutePipe } from '../../../../lab-core-pipe/lab-detail-route/lab-detail-route.pipe';
import { LabGetEntityTagsPipe } from '../../../lab-tag-core/pipe/lab-get-entity-tags.pipe';

@Component({
  selector: 'lab-note-table',
  templateUrl: './lab-note-table.component.html',
  styleUrls: ['./lab-note-table.component.scss'],
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
    FlTextIconModule,
    MatIcon,
    FlIconModule,
    MatTooltip,
    LabTagListComponent,
    FlUserModule,
    MatIconButton,
    MatHeaderRowDef,
    MatHeaderRow,
    MatRowDef,
    MatRow,
    TranslatePipe,
    FlColorModule,
    LabDetailRoutePipe,
    LabGetEntityTagsPipe,
  ],
})
export class LabNoteTableComponent {
  @Input({ required: true }) datasource: FlDatasource<LabNote>;

  @Input() columns: FlTableColumnStatic<LabNote>[] = ['title', 'tags', 'creation', 'lastModification'];

  // when true, the row become clickable and noteSelected event is trigger
  @Input() rowSelectable: boolean = false;

  @Input() rowLinkTarget: '_self' | '_blank' = '_self';

  @Output() noteSelected: EventEmitter<LabNote> = new EventEmitter();

  @Output() noteUnlink: EventEmitter<LabNote> = new EventEmitter();

  rowClicked(note: LabNote): void {
    if (this.rowSelectable) {
      this.noteSelected.next(note);
    }
  }

  unlinkNote(note: LabNote, event: MouseEvent): void {
    ClHelpService.stopEventPropagation(event);
    this.noteUnlink.next(note);
  }
}
