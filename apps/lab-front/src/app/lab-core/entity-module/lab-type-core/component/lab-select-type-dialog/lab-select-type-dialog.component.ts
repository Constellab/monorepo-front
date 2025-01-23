import { Component, OnInit, inject } from '@angular/core';
import { LabTypeEntity } from '../../../../model/entities/lab-type/lab-type.entity';
import { LabTypeSearchConfig } from '../../model/lab-type-search.class';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogContent } from '@angular/material/dialog';
import { FlTranslatableText } from '@monorepo/front-core-lib/fl-translate';
import { FlDialogModule } from '@monorepo/front-core-lib/fl-dialog';
import { CdkScrollable } from '@angular/cdk/scrolling';
import { LabTypeSearchComponent } from '../lab-type-search/lab-type-search.component';
import { AsyncPipe } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';
import { FlTranslateModule } from '@monorepo/front-core-lib/fl-translate';

export interface LabSelectTypeDialogInput {
  searchConfig: LabTypeSearchConfig;
  title?: string;
  helpText?: FlTranslatableText;
}

/**
 * Dialog containing the process type search to select one
 */
@Component({
  selector: 'lab-select-type-dialog',
  templateUrl: './lab-select-type-dialog.component.html',
  styleUrls: ['./lab-select-type-dialog.component.scss'],
  imports: [
    FlDialogModule,
    CdkScrollable,
    MatDialogContent,
    LabTypeSearchComponent,
    AsyncPipe,
    TranslatePipe,
    FlTranslateModule,
  ],
})
export class LabSelectTypeDialogComponent {
  private dialogRef = inject<MatDialogRef<LabSelectTypeDialogComponent>>(MatDialogRef);

  config: LabTypeSearchConfig;
  title: string;
  helpText: FlTranslatableText;

  constructor() {
    const data = inject<LabSelectTypeDialogInput>(MAT_DIALOG_DATA);

    this.config = data.searchConfig;
    this.title = data.title ?? 'biox.select_process';
    this.helpText = data.helpText;
  }

  onTypeSelected(type: LabTypeEntity): void {
    this.dialogRef.close(type);
  }
}
