import { Component, inject } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { FlCardModule } from '@monorepo/front-core-lib/fl-card';
import { FlInputFileModule } from '@monorepo/front-core-lib/fl-input-file';
import { FlSnackBarService } from '@monorepo/front-core-lib/fl-snack-bar';
import { FlTextIconModule } from '@monorepo/front-core-lib/fl-text-icon';
import { FlFileHelper } from '@monorepo/front-core-lib/fl-translate';
import { TranslatePipe } from '@ngx-translate/core';

import { CaSettingsService } from '../../../ca-core/service-api/ca-settings.service';

@Component({
  selector: 'ca-admin-other',
  templateUrl: './ca-admin-other.component.html',
  styleUrl: './ca-admin-other.component.scss',
  imports: [FlCardModule, FlTextIconModule, MatIcon, FlInputFileModule, TranslatePipe, MatButton],
})
export class CaAdminOtherComponent {
  private settingsService = inject(CaSettingsService);
  private snackBarService = inject(FlSnackBarService);

  downloadConstellabSuite(): void {
    this.settingsService.getConstellabSuite().subscribe((blob) => {
      FlFileHelper.downloadJsonFile(blob, 'constellab-suite.json');
    });
  }

  uploadConstellabSuite(file: File): void {
    this.settingsService.uploadConstellabSuite(file).subscribe(() => this.uploadConstellabSuiteSuccess());
  }

  private uploadConstellabSuiteSuccess(): void {
    this.snackBarService.openSuccessMessage({ text: 'constellab_suite_uploaded', translateText: true });
  }
}
