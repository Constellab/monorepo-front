import { ChangeDetectionStrategy,Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogContent, MatDialogRef } from '@angular/material/dialog';
import { MatDivider } from '@angular/material/divider';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { FlDialogModule } from '@monorepo/front-core-lib/fl-dialog';
import { FlLoaderModule } from '@monorepo/front-core-lib/fl-loader';
import { FlClipboardService, FlSnackBarService } from '@monorepo/front-core-lib/fl-snack-bar';
import { LiLab } from '@monorepo/lab-lib/li-core';
import { TranslatePipe } from '@ngx-translate/core';

import { LiLabService } from '../../service/li-lab.service';

@Component({
  selector: 'li-lab-registration-dialog',
  templateUrl: './li-lab-registration-dialog.component.html',
  styleUrls: ['./li-lab-registration-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    FlDialogModule,
    MatDialogContent,
    MatButtonModule,
    MatDivider,
    MatIcon,
    MatFormField,
    MatLabel,
    MatInput,
    FormsModule,
    FlLoaderModule,
    TranslatePipe,
  ],
})
export class LiLabRegistrationDialogComponent {
  private labService = inject(LiLabService);
  private clipboardService = inject(FlClipboardService);
  private snackBarService = inject(FlSnackBarService);
  private dialogRef = inject(MatDialogRef);

  generatedUrl: string | null = null;
  isGenerating = false;

  registerUrl = '';
  isRegistering = false;

  generateCode(): void {
    if (this.isGenerating) return;

    this.isGenerating = true;
    this.labService.generateCodeUrl().subscribe({
      next: (result) => {
        this.generatedUrl = result.url;
        this.isGenerating = false;
      },
      error: () => (this.isGenerating = false),
    });
  }

  copyUrl(): void {
    this.clipboardService.copy(this.generatedUrl, {
      text: 'li.lab_url_copied',
      translateText: true,
    });
  }

  register(): void {
    if (this.isRegistering || !this.registerUrl) return;

    this.isRegistering = true;
    this.labService.registerFromUrl(this.registerUrl).subscribe({
      next: (lab) => this.onRegisterSuccess(lab),
      error: () => (this.isRegistering = false),
    });
  }

  private onRegisterSuccess(lab: LiLab): void {
    this.isRegistering = false;
    this.snackBarService.openSuccessMessage('li.lab_registered');
    this.dialogRef.close(lab);
  }
}
