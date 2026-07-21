import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy,Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_SNACK_BAR_DATA, MatSnackBarRef } from '@angular/material/snack-bar';
import { FlSnackBarService } from '@monorepo/front-core-lib/fl-snack-bar';
import { FlTranslateModule } from '@monorepo/front-core-lib/fl-translate';

import { LiLogService } from '../../entity-service/li-log.service';
import { LiApiError } from '../../model/global/li-api-error.class';

export interface LiErrorSnackBarData {
  text: string;
  apiError: LiApiError;
  showAsSuccess: boolean;
  showSendToSupport: boolean;
}

@Component({
  selector: 'li-error-snack-bar',
  templateUrl: './li-error-snack-bar.component.html',
  styleUrls: ['./li-error-snack-bar.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [CommonModule, MatButtonModule, FlTranslateModule],
})
export class LiErrorSnackBarComponent {
  private data = inject<LiErrorSnackBarData>(MAT_SNACK_BAR_DATA);
  private snackBarRef = inject<MatSnackBarRef<LiErrorSnackBarComponent>>(MatSnackBarRef);
  private logService = inject(LiLogService);
  private snackBarService = inject(FlSnackBarService);

  text = this.data.text;
  showAsSuccess = this.data.showAsSuccess;
  showSendToSupport = this.data.showSendToSupport && !!this.data.apiError.requestId;

  close(): void {
    this.snackBarRef.dismiss();
  }

  sendToSupport(): void {
    this.logService.sendToSupport(this.data.apiError.requestId).subscribe({
      next: () => {
        this.snackBarRef.dismiss();
        this.snackBarService.openSuccessMessage(
          { text: 'li.error_sent_to_support', translateText: true },
          3000
        );
      },
      error: () => {
        this.snackBarService.openErrorMessage(
          { text: 'li.error_send_to_support_failed', translateText: true },
          5000
        );
      },
    });
  }
}
