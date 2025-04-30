import { Component, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { CaLabConfig } from '../../../../model/entities/lab/ca-lab-config.class';
import { MAT_DIALOG_DATA, MatDialogContent } from '@angular/material/dialog';
import { FlTranslatableText, FlTranslateModule } from '@monorepo/front-core-lib/fl-translate';
import { FlDialogModule } from '@monorepo/front-core-lib/fl-dialog';
import { FlSectionModule } from '@monorepo/front-core-lib/fl-section';
import { CaLabConfigComponent } from '../ca-lab-config/ca-lab-config.component';
import { AsyncPipe } from '@angular/common';

export interface CaLabConfigDialogInput {
  labConfig: Observable<CaLabConfig>;
  title: FlTranslatableText;
  helpText: FlTranslatableText;
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
  labConfig$: Observable<CaLabConfig>;
  title: FlTranslatableText;
  helpText: FlTranslatableText;

  constructor() {
    const input = inject<CaLabConfigDialogInput>(MAT_DIALOG_DATA);

    this.labConfig$ = input.labConfig;
    this.title = input.title;
    this.helpText = input.helpText;
  }
}
