import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
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
import { MatTooltip } from '@angular/material/tooltip';
import { RouterLink } from '@angular/router';
import { FlDatasource, FlTableColumnStatic } from '@monorepo/front-core-lib/fl-core';
import { FlIconModule } from '@monorepo/front-core-lib/fl-svg-icon';
import { FlUserModule } from '@monorepo/front-core-lib/fl-user';
import { TranslatePipe } from '@ngx-translate/core';

import { CaNotificationMarkDirective } from '../../../../../ca-core/entity-module/ca-notification-core/directive/ca-notification-mark/ca-notification-mark.directive';
import { CaNote } from '../../../../../ca-core/model/entities/folder/ca-note.class';
import { CaDetailRoutePipe } from '../../../../../ca-core/module/ca-core-pipe/ca-detail-route/ca-detail-route.pipe';
import { CaSyncObjectInfoComponent } from '../../../ca-folder-hierarchy-core/component/ca-sync-object-info/ca-sync-object-info.component';

@Component({
  selector: 'ca-note-table',
  templateUrl: './ca-note-table.component.html',
  styleUrls: ['./ca-note-table.component.scss'],
  imports: [
    MatTable,
    MatColumnDef,
    MatHeaderCellDef,
    MatHeaderCell,
    MatCellDef,
    MatCell,
    RouterLink,
    CaNotificationMarkDirective,
    MatIcon,
    FlIconModule,
    MatTooltip,
    CaSyncObjectInfoComponent,
    FlUserModule,
    MatHeaderRowDef,
    MatHeaderRow,
    MatRowDef,
    MatRow,
    CaDetailRoutePipe,
    TranslatePipe,
  ],
})
export class CaNoteTableComponent {
  @Input({ required: true }) datasource: FlDatasource<CaNote>;

  @Input() columns: FlTableColumnStatic<CaNote>[] = ['title', 'createdBy', 'lastSync'];

  // when true, the row become clickable and resourceSelected event is trigger
  @Input() rowSelectable: boolean = false;

  @Output() noteSelected: EventEmitter<CaNote> = new EventEmitter();

  rowClicked(note: CaNote): void {
    if (this.rowSelectable) {
      this.noteSelected.next(note);
    }
  }
}
