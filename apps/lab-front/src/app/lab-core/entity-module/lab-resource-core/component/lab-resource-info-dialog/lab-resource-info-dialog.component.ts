import {Component, Inject} from '@angular/core';
import {LabResource} from '../../../../model/entities/resource/lab-resource.entity';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';

export interface LabResourceInfoDialogInput {
  resource: LabResource;
}

@Component({
  selector: 'lab-resource-info-dialog',
  templateUrl: './lab-resource-info-dialog.component.html',
  styleUrls: ['./lab-resource-info-dialog.component.scss'],
})
export class LabResourceInfoDialogComponent {

  resource: LabResource;

  constructor(@Inject(MAT_DIALOG_DATA) input: LabResourceInfoDialogInput) {
    this.resource = input.resource;
  }
}
