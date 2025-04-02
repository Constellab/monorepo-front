import { CdkScrollable } from '@angular/cdk/scrolling';
import { Component, OnInit, inject } from '@angular/core';
import { FlCoreDirectiveModule } from '@monorepo/front-core-lib/fl-core-directive';
import { FlCorePipeModule } from '@monorepo/front-core-lib/fl-core-pipe';
import { FlDialogModule } from '@monorepo/front-core-lib/fl-dialog';
import { FlLoaderModule } from '@monorepo/front-core-lib/fl-loader';
import { FlSnackBarService } from '@monorepo/front-core-lib/fl-snack-bar';
import { FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { LiViewConfig, LiViewConfigService } from '@monorepo/lab-lib/li-core';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogContent, MatDialogRef } from '@angular/material/dialog';
import { MatButton } from '@angular/material/button';
import { MatError, MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { TranslatePipe } from '@ngx-translate/core';

/**
 * Dialog to update the config view (only title for now)
 */
@Component({
  selector: 'li-update-view-config-dialog',
  templateUrl: './li-update-view-config-dialog.component.html',
  styleUrls: ['./li-update-view-config-dialog.component.scss'],
  imports: [
    FlDialogModule,
    CdkScrollable,
    MatDialogContent,
    ReactiveFormsModule,
    FormsModule,
    MatFormField,
    MatLabel,
    MatInput,
    FlCoreDirectiveModule,
    MatError,
    MatDialogActions,
    MatButton,
    FlLoaderModule,
    FlCorePipeModule,
    TranslatePipe,
  ],
})
export class LiUpdateViewConfigDialogComponent implements OnInit {
  private viewConfig = inject<LiViewConfig>(MAT_DIALOG_DATA);
  private dialogRef = inject<MatDialogRef<LiUpdateViewConfigDialogComponent>>(MatDialogRef);
  private viewConfigService = inject(LiViewConfigService);
  private snackBarService = inject(FlSnackBarService);

  formCtrl: FormControl<string>;

  isLoading: boolean = false;

  ngOnInit(): void {
    this.formCtrl = new FormControl<string>(this.viewConfig.title, [Validators.required]);
  }

  submit(): void {
    if (!this.isLoading && this.formCtrl.valid) {
      this.updateTitle(this.formCtrl.value);
    }
  }

  private updateTitle(title: string): void {
    this.isLoading = true;
    this.viewConfigService.updateTitle(this.viewConfig.id, title).subscribe({
      next: (resource) => this.updateNameSuccess(resource),
      error: () => (this.isLoading = false),
    });
  }

  private updateNameSuccess(viewConfig: LiViewConfig): void {
    this.snackBarService.openSuccessMessage({
      text: 'li.view_config_title_updated',
      translateText: true,
    });
    this.dialogRef.close(viewConfig);
    this.isLoading = false;
  }
}
