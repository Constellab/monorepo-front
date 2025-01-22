import { Component, Input } from '@angular/core';
import { FlArrayObs } from '@monorepo/front-core-lib';
import { CaLabVolumePeriod } from '../../../../ca-core/model/entities/lab/ca-lab-stats.dto';
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
import { MatTooltip } from '@angular/material/tooltip';
import { DecimalPipe } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';
import { FlDateModule } from '../../../../../../../../libs/front-core-lib/src/lib/module/fl-date/fl-date.module';

@Component({
  selector: 'ca-lab-volume-price-table',
  templateUrl: './ca-lab-volume-price-table.component.html',
  styleUrl: './ca-lab-volume-price-table.component.scss',
  imports: [
    MatTable,
    MatColumnDef,
    MatHeaderCellDef,
    MatHeaderCell,
    MatCellDef,
    MatCell,
    MatTooltip,
    MatHeaderRowDef,
    MatHeaderRow,
    MatRowDef,
    MatRow,
    DecimalPipe,
    TranslatePipe,
    FlDateModule,
  ],
})
export class CaLabVolumePriceTableComponent {
  @Input() datasource: FlArrayObs<CaLabVolumePeriod>;

  @Input() columns: string[] = ['dates', 'volume', 'volumePricePerGBPerHour', 'volumePrice'];
}
