import { Component, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { CaLabConfig } from '../../../../model/entities/lab/ca-lab-config.class';
import { MAT_DIALOG_DATA, MatDialogContent } from '@angular/material/dialog';
import { FlTranslatableText } from '@monorepo/front-core-lib';
import { FlDialogModule } from '../../../../../../../../../libs/front-core-lib/src/lib/module/fl-dialog/fl-dialog.module';
import { CdkScrollable } from '@angular/cdk/scrolling';
import { FlSectionModule } from '../../../../../../../../../libs/front-core-lib/src/lib/module/fl-section/fl-section.module';
import { CaLabConfigComponent } from '../ca-lab-config/ca-lab-config.component';
import { AsyncPipe } from '@angular/common';
import { FlTranslateModule } from '../../../../../../../../../libs/front-core-lib/src/lib/module/fl-translate/fl-translate.module';

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
    CdkScrollable,
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
