import { ChangeDetectionStrategy,Component, inject, Input } from '@angular/core';
import { FlDialogService } from '@monorepo/front-core-lib/fl-dialog';
import { DateTime } from 'luxon';

import { TeTimestampFormat } from '../../block/te-timestamp-block.class';
import { TeElementBlockDirective } from '../../model/te-element.directive';
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
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class TeTimestampComponent extends TeElementBlockDirective {
  private dialogService = inject(FlDialogService);

  @Input({ required: true }) timestamp: DateTime;

  @Input() format?: TeTimestampFormat;

  defaultFormat: TeTimestampFormat = 'DATE_TIME_WITH_SECONDS';

  openSettings(): void {
    const data: TeTimestampConfigDialogInput = {
      timestamp: this.timestamp,
      format: this.format ?? this.defaultFormat,
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
