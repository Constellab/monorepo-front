import { ChangeDetectionStrategy,Component, inject, output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { FlCardModule } from '@monorepo/front-core-lib/fl-card';
import { FlInputFileModule } from '@monorepo/front-core-lib/fl-input-file';
import { FlSnackBarModule, FlSnackBarService } from '@monorepo/front-core-lib/fl-snack-bar';
import { FlTextIconModule } from '@monorepo/front-core-lib/fl-text-icon';
import { FlFileHelper, FlTranslateModule } from '@monorepo/front-core-lib/fl-translate';
import { lastValueFrom } from 'rxjs';

import { LmsLabManagerConfiguration } from '../../model/lms-lab-manager.class';
import { LmsLabService } from '../../service/lms-lab.service';
import { LmsLabState } from '../../service/lms-lab.state';

/**
 * Component to upload the configuration json to configure lab manager
 */
@Component({
  selector: 'lms-configure-lab-manager',
  imports: [
    FlCardModule,
    FlTextIconModule,
    FlTranslateModule,
    FlInputFileModule,
    MatIconModule,
    FlSnackBarModule,
  ],
  templateUrl: './lms-configure-lab-manager.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './lms-configure-lab-manager.component.scss',
})
export class LmsConfigureLabManagerComponent {
  labManagerConfigured = output<void>();

  isLoading: boolean = false;

  private labService = inject(LmsLabService);
  private state = inject(LmsLabState);
  private snackBarService = inject(FlSnackBarService);

  async onFileChange(event: File | File[]): Promise<void> {
    if (Array.isArray(event)) {
      this.snackBarService.openErrorMessage('PLease upload only one file');
      return;
    }

    let json: LmsLabManagerConfiguration;
    try {
      json = await lastValueFrom(FlFileHelper.readBlobContent(event, true));
    } catch {
      this.snackBarService.openErrorMessage('lms.incorrect_configuration_file');
      return;
    }

    this.isLoading = true;

    this.labService.configureLabManager(json).subscribe({
      next: () => this.onConfigureSuccess(),
      error: () => (this.isLoading = false),
    });
  }

  private onConfigureSuccess(): void {
    this.snackBarService.openSuccessMessage('lms.lab_manager_configured');
    this.state.refreshStatus();
    this.isLoading = false;
    this.labManagerConfigured.emit();
  }
}
