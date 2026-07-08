import { Component, inject } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { FlDialogModule } from '@monorepo/front-core-lib/fl-dialog';
import { FlLoaderModule } from '@monorepo/front-core-lib/fl-loader';
import { FlSnackBarService } from '@monorepo/front-core-lib/fl-snack-bar';
import { FlTextIconModule } from '@monorepo/front-core-lib/fl-text-icon';
import { TranslatePipe } from '@ngx-translate/core';

import { CaConstellabSuiteAppDTO } from '../../../ca-core/model/entities/ca-constellab-suite.class';
import { CaIconContainerComponent } from '../../../ca-core/module/ca-core-component/ca-icon-container/ca-icon-container.component';
import { CaSettingsService } from '../../../ca-core/service-api/ca-settings.service';

export interface CaConstellabSuiteDetailDialogInput {
  app: CaConstellabSuiteAppDTO;
}

@Component({
  selector: 'ca-constellab-suite-detail-dialog',
  templateUrl: './ca-constellab-suite-detail-dialog.component.html',
  styleUrls: ['./ca-constellab-suite-detail-dialog.component.scss'],
  imports: [
    FlDialogModule,
    MatButton,
    MatIcon,
    FlTextIconModule,
    FlLoaderModule,
    TranslatePipe,
    CaIconContainerComponent,
  ],
})
export class CaConstellabSuiteDetailDialogComponent {
  private input: CaConstellabSuiteDetailDialogInput = inject(MAT_DIALOG_DATA);
  private settingsService = inject(CaSettingsService);
  private snackBarService = inject(FlSnackBarService);

  dialogRef = inject(MatDialogRef);

  app = this.input.app;
  isRequestingApp = false;

  openCommunityLink(): void {
    if (this.app.communityAppLink) {
      window.open(this.app.communityAppLink, '_blank', 'noopener,noreferrer');
    }
  }

  requestApp(): void {
    if (!this.isRequestingApp) {
      this.isRequestingApp = true;
      this.settingsService.requestApp({ appName: this.app.name }).subscribe({
        next: () => {
          this.snackBarService.openSuccessMessage('app_request_success');
          this.isRequestingApp = false;
          this.dialogRef.close();
        },
        error: () => {
          this.isRequestingApp = false;
        },
      });
    }
  }
}
