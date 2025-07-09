import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatIconAnchor } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogContent } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { MatTooltip } from '@angular/material/tooltip';
import { FlDialogModule } from '@monorepo/front-core-lib/fl-dialog';
import { FlSectionModule } from '@monorepo/front-core-lib/fl-section';
import { LiProgressBarService } from '@monorepo/lab-lib/li-core';
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
  private labProgressBarService = inject(LiProgressBarService);

  processRunInfo$: LiProgressBarInfoDialogData = inject(MAT_DIALOG_DATA);

  downloadUrl$: Observable<string> = this.processRunInfo$.pipe(
    map((data) => this.labProgressBarService.getDownloadProgressBarUrl(data.progressBar.id))
  );
}
