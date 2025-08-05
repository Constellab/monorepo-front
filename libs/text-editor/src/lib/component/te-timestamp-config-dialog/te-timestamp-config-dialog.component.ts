import { Component, inject } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DateTime } from 'luxon';

import { TeTimestampFormat } from '../../block/te-timestamp-block.class';

export interface TeTimestampConfigDialogInput {
  timestamp: DateTime;
  format?: TeTimestampFormat;
}

interface TeTimestampFormatOptions {
  value: TeTimestampFormat;
  label: string;
}

/**
 * Dialog to configure timestamp block
 */
@Component({
  selector: 'te-timestamp-config-dialog',
  templateUrl: './te-timestamp-config-dialog.component.html',
  styleUrl: './te-timestamp-config-dialog.component.scss',
  standalone: false,
})
export class TeTimestampConfigDialogComponent {
  private dialogRef = inject<MatDialogRef<TeTimestampConfigDialogComponent>>(MatDialogRef);

  formGp = new FormBuilder().group({
    timestamp: null as DateTime,
    format: null as TeTimestampFormat,
  });

  formatOptions: TeTimestampFormatOptions[] = [
    {
      value: 'DATE_TIME',
      label: 'teTextEditor.timestamp_format_date_time',
    },
    {
      value: 'DATE_TIME_WITH_SECONDS',
      label: 'teTextEditor.timestamp_format_date_time_seconds',
    },
    {
      value: 'DATE',
      label: 'teTextEditor.timestamp_format_date',
    },
    {
      value: 'TIME_WITH_SECONDS',
      label: 'teTextEditor.timestamp_format_time',
    },
    {
      value: 'fromNow',
      label: 'teTextEditor.timestamp_format_from_now',
    },
  ];

  constructor() {
    const input = inject<TeTimestampConfigDialogInput>(MAT_DIALOG_DATA);

    this.formGp.patchValue(input);
  }

  submit(): void {
    if (this.formGp.valid) {
      this.dialogRef.close(this.formGp.value);
    }
  }

  get timestamp(): DateTime {
    return this.formGp.value.timestamp;
  }
}
