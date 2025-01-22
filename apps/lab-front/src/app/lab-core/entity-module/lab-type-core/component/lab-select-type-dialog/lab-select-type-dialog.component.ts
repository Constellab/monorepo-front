import { Component, OnInit, inject } from '@angular/core';
import { LabTypeEntity } from '../../../../model/entities/lab-type/lab-type.entity';
import { LabTypeSearchConfig } from '../../model/lab-type-search.class';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FlTranslatableText } from '@monorepo/front-core-lib';

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
  standalone: false,
})
export class LabSelectTypeDialogComponent implements OnInit {
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

  ngOnInit(): void {}

  onTypeSelected(type: LabTypeEntity): void {
    this.dialogRef.close(type);
  }
}
