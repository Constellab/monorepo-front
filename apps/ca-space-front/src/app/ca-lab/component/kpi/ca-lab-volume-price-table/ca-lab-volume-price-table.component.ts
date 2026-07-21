import { DecimalPipe } from '@angular/common';
import { ChangeDetectionStrategy,Component, Input } from '@angular/core';
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
import { FlArrayObs } from '@monorepo/front-core-lib/fl-core';
import { FlDateModule } from '@monorepo/front-core-lib/fl-date';
import { TranslatePipe } from '@ngx-translate/core';

import { CaLabVolumePeriod } from '../../../../ca-core/model/entities/lab/ca-lab-stats.dto';

@Component({
  selector: 'ca-lab-volume-price-table',
  templateUrl: './ca-lab-volume-price-table.component.html',
  styleUrl: './ca-lab-volume-price-table.component.scss',
  changeDetection: ChangeDetectionStrategy.Eager,
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
