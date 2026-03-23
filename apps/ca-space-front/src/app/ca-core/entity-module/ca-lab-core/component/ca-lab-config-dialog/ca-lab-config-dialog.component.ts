import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogContent } from '@angular/material/dialog';
import { FlDialogModule } from '@monorepo/front-core-lib/fl-dialog';
import { FlSectionModule } from '@monorepo/front-core-lib/fl-section';
import { FlTranslatableText, FlTranslateModule } from '@monorepo/front-core-lib/fl-translate';
import { Observable } from 'rxjs';

import { CaLabConfig } from '../../../../model/entities/lab/ca-lab-config.class';
import { CaLabConfigComponent } from '../ca-lab-config/ca-lab-config.component';

export interface CaLabConfigDialogInput {
  labConfig: Observable<CaLabConfig>;
  title: FlTranslatableText;
  helpText: FlTranslatableText;
  showDetailButton?: boolean;
}

/**
 * Show the configuration of a lab
 */
@Component({
  selector: 'ca-lab-config-dialog',
  templateUrl: './ca-lab-config-dialog.component.html',
  styleUrls: ['./ca-lab-config-dialog.component.scss'],
  imports: [
    FlDialogModule,
    MatDialogContent,
    FlSectionModule,
    CaLabConfigComponent,
    AsyncPipe,
    FlTranslateModule,
  ],
})
export class CaLabConfigDialogComponent {
  data = inject<CaLabConfigDialogInput>(MAT_DIALOG_DATA);
}
