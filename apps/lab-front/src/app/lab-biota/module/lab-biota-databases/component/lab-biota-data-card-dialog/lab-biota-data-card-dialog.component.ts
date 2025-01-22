import { Component, OnInit, inject } from '@angular/core';
import { LabBiotaData } from '../../../../model/lab-biota-data.class';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

/**
 * Simple card for biota data
 */
@Component({
  selector: 'lab-biota-data-card-dialog',
  templateUrl: './lab-biota-data-card-dialog.component.html',
  styleUrls: ['./lab-biota-data-card-dialog.component.scss'],
  standalone: false,
})
export class LabBiotaDataCardDialogComponent implements OnInit {
  biotaData: LabBiotaData;

  constructor() {
    const biotaData = inject<LabBiotaData>(MAT_DIALOG_DATA);

    this.biotaData = biotaData;
  }

  ngOnInit(): void {}
}
