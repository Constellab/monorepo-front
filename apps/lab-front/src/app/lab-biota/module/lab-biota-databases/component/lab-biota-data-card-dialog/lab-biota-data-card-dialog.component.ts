import { Component, OnInit, inject } from '@angular/core';
import { LabBiotaData } from '../../../../model/lab-biota-data.class';
import { MAT_DIALOG_DATA, MatDialogContent } from '@angular/material/dialog';
import { FlDialogModule } from '../../../../../../../../../libs/front-core-lib/src/lib/module/fl-dialog/fl-dialog.module';
import { CdkScrollable } from '@angular/cdk/scrolling';
import { LabBiotaDataCardComponent } from '../lab-biota-data-card/lab-biota-data-card.component';

/**
 * Simple card for biota data
 */
@Component({
  selector: 'lab-biota-data-card-dialog',
  templateUrl: './lab-biota-data-card-dialog.component.html',
  styleUrls: ['./lab-biota-data-card-dialog.component.scss'],
  imports: [FlDialogModule, CdkScrollable, MatDialogContent, LabBiotaDataCardComponent],
})
export class LabBiotaDataCardDialogComponent implements OnInit {
  biotaData: LabBiotaData;

  constructor() {
    const biotaData = inject<LabBiotaData>(MAT_DIALOG_DATA);

    this.biotaData = biotaData;
  }

  ngOnInit(): void {}
}
