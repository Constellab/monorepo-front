import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatIconButton } from '@angular/material/button';
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
import { FlDatasourcePaginated } from '@monorepo/front-core-lib/fl-core';
import { FlInfiniteScrollModule } from '@monorepo/front-core-lib/fl-infinite-scroll';
import { TranslatePipe } from '@ngx-translate/core';

import { LabBiotaData } from '../../../model/lab-biota-data.class';

@Component({
  selector: 'lab-biota-database-table',
  templateUrl: './lab-biota-database-table.component.html',
  styleUrls: ['./lab-biota-database-table.component.scss'],
  imports: [
    FlInfiniteScrollModule,
    MatTable,
    MatColumnDef,
    MatHeaderCellDef,
    MatHeaderCell,
    MatCellDef,
    MatCell,
    MatIconButton,
    MatTooltip,
    MatIcon,
    MatHeaderRowDef,
    MatHeaderRow,
    MatRowDef,
    MatRow,
    TranslatePipe,
  ],
})
export class LabBiotaDatabaseTableComponent {
  @Input() datasource: FlDatasourcePaginated<LabBiotaData>;

  @Input() columns: string[] = ['id', 'name'];

  @Output() showDetail: EventEmitter<LabBiotaData> = new EventEmitter();

  onShowDetail(data: LabBiotaData): void {
    this.showDetail.emit(data);
  }
}
