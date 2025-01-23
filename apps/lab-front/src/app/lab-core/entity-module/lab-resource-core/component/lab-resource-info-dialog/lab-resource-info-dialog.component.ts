import { Component, inject } from '@angular/core';
import { LabResource } from '../../../../model/entities/resource/lab-resource.entity';
import { MAT_DIALOG_DATA, MatDialogContent } from '@angular/material/dialog';
import { FlDialogModule } from '@monorepo/front-core-lib/fl-dialog';
import { TdTechnicalDocModule } from '../../../../../../../../../libs/technical-doc/src/lib/td-technical-doc.module';
import { LabResourceInfoComponent } from '../lab-resource-info/lab-resource-info.component';
import { LabResourceViewHistoricComponent } from '../lab-resource-view-historic/lab-resource-view-historic.component';
import { LabScenariosUsingResourceComponent } from '../lab-scenarios-using-resource/lab-scenarios-using-resource.component';
import { LabNotesUsingResourceComponent } from '../lab-notes-using-resource/lab-notes-using-resource.component';

export interface LabResourceInfoDialogInput {
  resource: LabResource;
}

@Component({
  selector: 'lab-resource-info-dialog',
  templateUrl: './lab-resource-info-dialog.component.html',
  styleUrls: ['./lab-resource-info-dialog.component.scss'],
  imports: [
    FlDialogModule,
    TdTechnicalDocModule,
    MatDialogContent,
    LabResourceInfoComponent,
    LabResourceViewHistoricComponent,
    LabScenariosUsingResourceComponent,
    LabNotesUsingResourceComponent,
  ],
})
export class LabResourceInfoDialogComponent {
  resource: LabResource;

  constructor() {
    const input = inject<LabResourceInfoDialogInput>(MAT_DIALOG_DATA);

    this.resource = input.resource;
  }
}
