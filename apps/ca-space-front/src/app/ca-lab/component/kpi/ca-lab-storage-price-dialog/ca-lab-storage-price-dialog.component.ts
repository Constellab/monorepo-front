import { Component, inject } from '@angular/core';
import { MatButton } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
} from '@angular/material/dialog';
import { FlArrayObs } from '@monorepo/front-core-lib/fl-core';
import { FlDialogModule } from '@monorepo/front-core-lib/fl-dialog';
import { TranslatePipe } from '@ngx-translate/core';

import {
  CaLabBackupPeriod,
  CaLabVolumePeriod,
} from '../../../../ca-core/model/entities/lab/ca-lab-stats.dto';
import { CaLabBackupStoragePriceTableComponent } from '../ca-lab-backup-storage-price-table/ca-lab-backup-storage-price-table.component';
import { CaLabVolumePriceTableComponent } from '../ca-lab-volume-price-table/ca-lab-volume-price-table.component';

export interface CaLabStoragePriceDialogInput {
  volumes: CaLabVolumePeriod[];
  backups: CaLabBackupPeriod[];
}

class CaLabVolumeArrayObs extends FlArrayObs<CaLabVolumePeriod> {
  protected equals(a: CaLabVolumePeriod, b: CaLabVolumePeriod): boolean {
    return a.fromDate === b.fromDate;
  }
}

class CaLabBackupArrayObs extends FlArrayObs<CaLabBackupPeriod> {
  protected equals(a: CaLabBackupPeriod, b: CaLabBackupPeriod): boolean {
    return a.fromDate === b.fromDate;
  }
}

/**
 * Dialog to show the detail for lab volume price and backup store price
 */
@Component({
  selector: 'ca-lab-storage-price-dialog',
  templateUrl: './ca-lab-storage-price-dialog.component.html',
  styleUrl: './ca-lab-storage-price-dialog.component.scss',
  imports: [
    FlDialogModule,
    MatDialogContent,
    CaLabVolumePriceTableComponent,
    CaLabBackupStoragePriceTableComponent,
    MatDialogActions,
    MatButton,
    MatDialogClose,
    TranslatePipe,
  ],
})
export class CaLabStoragePriceDialogComponent {
  data: CaLabStoragePriceDialogInput = inject(MAT_DIALOG_DATA);

  volumes = new CaLabVolumeArrayObs([...this.data.volumes].reverse());

  backups = new CaLabBackupArrayObs([...this.data.backups].reverse());
}
