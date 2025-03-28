import { AsyncPipe } from '@angular/common';
import { CdkScrollable } from '@angular/cdk/scrolling';
import { Component, OnInit, inject } from '@angular/core';
import { FlDialogModule } from '@monorepo/front-core-lib/fl-dialog';
import { FlTranslatableText, FlTranslateModule } from '@monorepo/front-core-lib/fl-translate';
import { LiTypeEntity, LiTypeSearchConfig } from '@monorepo/lab-lib/li-core';
import { LiTypeSearchComponent } from '../li-type-search/li-type-search.component';
import { MAT_DIALOG_DATA, MatDialogContent, MatDialogRef } from '@angular/material/dialog';
import { TranslatePipe } from '@ngx-translate/core';

export interface LiSelectTypeDialogInput {
  searchConfig: LiTypeSearchConfig;
  title?: string;
  helpText?: FlTranslatableText;
}

/**
 * Dialog containing the process type search to select one
 */
@Component({
  selector: 'li-select-type-dialog',
  templateUrl: './li-select-type-dialog.component.html',
  styleUrls: ['./li-select-type-dialog.component.scss'],
  imports: [
    FlDialogModule,
    CdkScrollable,
    MatDialogContent,
    LiTypeSearchComponent,
    AsyncPipe,
    TranslatePipe,
    FlTranslateModule,
  ],
})
export class LiSelectTypeDialogComponent {
  private dialogRef = inject<MatDialogRef<LiSelectTypeDialogComponent>>(MatDialogRef);

  config: LiTypeSearchConfig;
  title: string;
  helpText: FlTranslatableText;

  constructor() {
    const data = inject<LiSelectTypeDialogInput>(MAT_DIALOG_DATA);

    this.config = data.searchConfig;
    this.title = data.title ?? 'biox.select_process';
    this.helpText = data.helpText;
  }

  onTypeSelected(type: LiTypeEntity): void {
    this.dialogRef.close(type);
  }
}
