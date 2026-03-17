import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatSortHeader } from '@angular/material/sort';
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
import { FlArrayObs, FlTableColumnStatic } from '@monorepo/front-core-lib/fl-core';
import { FlCorePipeModule } from '@monorepo/front-core-lib/fl-core-pipe';
import { FlSearchModule } from '@monorepo/front-core-lib/fl-search';
import { LiLab, LiLabMode } from '@monorepo/lab-lib/li-core';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'li-lab-table',
  templateUrl: './li-lab-table.component.html',
  styleUrls: ['./li-lab-table.component.scss'],
  imports: [
    MatTable,
    FlSearchModule,
    MatColumnDef,
    MatHeaderCellDef,
    MatHeaderCell,
    MatCellDef,
    MatCell,
    MatHeaderRowDef,
    MatHeaderRow,
    MatRowDef,
    MatRow,
    MatSortHeader,
    FlCorePipeModule,
    TranslatePipe,
  ],
})
export class LiLabTableComponent {
  @Input() datasource: FlArrayObs<LiLab>;

  @Input() columns: FlTableColumnStatic<LiLab>[];

  @Input() rowSelectable: boolean = false;

  @Output() labSelected: EventEmitter<LiLab> = new EventEmitter();

  labModes = LiLabMode;

  rowClicked(lab: LiLab): void {
    if (this.rowSelectable) {
      this.labSelected.next(lab);
    }
  }
}
