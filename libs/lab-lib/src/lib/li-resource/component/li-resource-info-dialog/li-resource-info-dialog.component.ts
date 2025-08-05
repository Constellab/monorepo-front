import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogContent } from '@angular/material/dialog';
import { FlDialogModule } from '@monorepo/front-core-lib/fl-dialog';
import { LiResource } from '@monorepo/lab-lib/li-core';
import { TdTechnicalDocModule } from '@monorepo/technical-doc';

import { LiNotesUsingResourceComponent } from '../li-notes-using-resource/li-notes-using-resource.component';
import { LiResourceInfoComponent } from '../li-resource-info/li-resource-info.component';
import { LiResourceViewHistoricComponent } from '../li-resource-view-historic/li-resource-view-historic.component';
import { LiScenariosUsingResourceComponent } from '../li-scenarios-using-resource/li-scenarios-using-resource.component';

export interface LiResourceInfoDialogInput {
  resource: LiResource;
}

@Component({
  selector: 'li-resource-info-dialog',
  templateUrl: './li-resource-info-dialog.component.html',
  styleUrls: ['./li-resource-info-dialog.component.scss'],
  imports: [
    FlDialogModule,
    TdTechnicalDocModule,
    MatDialogContent,
    LiResourceInfoComponent,
    LiResourceViewHistoricComponent,
    LiScenariosUsingResourceComponent,
    LiNotesUsingResourceComponent,
  ],
})
export class LiResourceInfoDialogComponent {
  resource: LiResource;

  constructor() {
    const input = inject<LiResourceInfoDialogInput>(MAT_DIALOG_DATA);

    this.resource = input.resource;
  }
}
