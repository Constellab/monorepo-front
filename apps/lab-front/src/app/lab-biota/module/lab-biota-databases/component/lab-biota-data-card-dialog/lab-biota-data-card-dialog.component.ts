import { ChangeDetectionStrategy,Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogContent } from '@angular/material/dialog';
import { FlDialogModule } from '@monorepo/front-core-lib/fl-dialog';

import { LabBiotaData } from '../../../../model/lab-biota-data.class';
import { LabBiotaDataCardComponent } from '../lab-biota-data-card/lab-biota-data-card.component';

/**
 * Simple card for biota data
 */
@Component({
  selector: 'lab-biota-data-card-dialog',
  templateUrl: './lab-biota-data-card-dialog.component.html',
  styleUrls: ['./lab-biota-data-card-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [FlDialogModule, MatDialogContent, LabBiotaDataCardComponent],
})
export class LabBiotaDataCardDialogComponent {
  biotaData: LabBiotaData;

  constructor() {
    const biotaData = inject<LabBiotaData>(MAT_DIALOG_DATA);

    this.biotaData = biotaData;
  }
}
