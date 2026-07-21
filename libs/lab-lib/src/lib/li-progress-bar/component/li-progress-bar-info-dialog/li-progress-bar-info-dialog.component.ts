import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy,Component, inject } from '@angular/core';
import { MatIconAnchor } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogContent } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { MatTooltip } from '@angular/material/tooltip';
import { FlDialogModule } from '@monorepo/front-core-lib/fl-dialog';
import { FlSectionModule } from '@monorepo/front-core-lib/fl-section';
import { LiProcessService } from '@monorepo/lab-lib/li-core';
import { TranslatePipe } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import {
  LiProcessRunInfoData,
  LiProgressBarInfoComponent,
} from '../li-progress-bar-info/li-progress-bar-info.component';

export type LiProgressBarInfoDialogData = Observable<LiProcessRunInfoData>;

/**
 * Show information about a {@link LiProgressBar} in a dialog
 */
@Component({
  selector: 'li-progress-bar-info-dialog',
  templateUrl: './li-progress-bar-info-dialog.component.html',
  styleUrls: ['./li-progress-bar-info-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    FlDialogModule,
    MatIconAnchor,
    MatTooltip,
    MatIcon,
    MatDialogContent,
    FlSectionModule,
    LiProgressBarInfoComponent,
    AsyncPipe,
    TranslatePipe,
  ],
})
export class LiProgressBarInfoDialogComponent {
  private processService = inject(LiProcessService);

  processRunInfo$: LiProgressBarInfoDialogData = inject(MAT_DIALOG_DATA);

  downloadUrl$: Observable<string> = this.processRunInfo$.pipe(
    map((data) => this.processService.getDownloadProgressBarUrl(data.processType, data.processId))
  );
}
