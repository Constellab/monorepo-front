import { Component, Input, inject } from '@angular/core';
import { TeElementBlockDirective } from '../../model/te-element.directive';
import { DateTime } from 'luxon';
import { TeTimestampFormat } from '../../block/te-timestamp-block.class';
import { FlDialogService } from '@monorepo/front-core-lib/fl-dialog';
import {
  TeTimestampConfigDialogComponent,
  TeTimestampConfigDialogInput,
} from '../te-timestamp-config-dialog/te-timestamp-config-dialog.component';

/**
 * Text editor block to show a timestamp
 */
@Component({
  selector: 'te-timestamp',
  templateUrl: './te-timestamp.component.html',
  styleUrl: './te-timestamp.component.scss',
  host: {
    'attr.contenteditable': 'false',
  },
  standalone: false,
})
export class TeTimestampComponent extends TeElementBlockDirective {
  private dialogService = inject(FlDialogService);

  @Input({ required: true }) timestamp: DateTime;

  @Input() format?: TeTimestampFormat;

  constructor() {
    super();
  }

  openSettings(): void {
    const data: TeTimestampConfigDialogInput = {
      timestamp: this.timestamp,
      format: this.format,
    };

    this.dialogService
      .openSmallDialog(TeTimestampConfigDialogComponent, {
        data,
      })
      .afterClosed()
      .subscribe((result) => this.onDialogClosed(result));
  }

  private onDialogClosed(result: TeTimestampConfigDialogInput): void {
    if (result) {
      this.timestamp = result.timestamp;
      this.format = result.format;
    }
  }
}
