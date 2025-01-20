import { Component, Inject } from '@angular/core';
import { DateTime } from 'luxon';
import { TeTimestampFormat } from '../../block/te-timestamp-block.class';
import { FormBuilder } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

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
    standalone: false
})
export class TeTimestampConfigDialogComponent {
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

  constructor(
    @Inject(MAT_DIALOG_DATA) input: TeTimestampConfigDialogInput,
    private dialogRef: MatDialogRef<TeTimestampConfigDialogComponent>
  ) {
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
