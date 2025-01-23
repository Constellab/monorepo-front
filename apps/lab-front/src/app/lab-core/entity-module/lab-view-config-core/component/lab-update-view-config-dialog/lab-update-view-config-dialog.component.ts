import { Component, OnInit, inject } from '@angular/core';
import { FlSnackBarService } from '@monorepo/front-core-lib/fl-snack-bar';
import { FormControl, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { LabViewConfig } from '../../../../model/entities/resource/lab-view-config.entity';
import { LabViewConfigService } from '../../../../entity-service/lab-view-config.service';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogContent, MatDialogActions } from '@angular/material/dialog';
import { FlDialogModule } from '@monorepo/front-core-lib/fl-dialog';
import { CdkScrollable } from '@angular/cdk/scrolling';
import { MatFormField, MatLabel, MatError } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { FlCoreDirectiveModule } from '@monorepo/front-core-lib/fl-core-directive';
import { MatButton } from '@angular/material/button';
import { FlLoaderModule } from '@monorepo/front-core-lib/fl-loader';
import { FlCorePipeModule } from '@monorepo/front-core-lib/fl-core-pipe';
import { TranslatePipe } from '@ngx-translate/core';

/**
 * Dialog to update the config view (only title for now)
 */
@Component({
  selector: 'lab-update-view-config-dialog',
  templateUrl: './lab-update-view-config-dialog.component.html',
  styleUrls: ['./lab-update-view-config-dialog.component.scss'],
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
export class LabUpdateViewConfigDialogComponent implements OnInit {
  private viewConfig = inject<LabViewConfig>(MAT_DIALOG_DATA);
  private dialogRef = inject<MatDialogRef<LabUpdateViewConfigDialogComponent>>(MatDialogRef);
  private viewConfigService = inject(LabViewConfigService);
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

  private updateNameSuccess(viewConfig: LabViewConfig): void {
    this.snackBarService.openSuccessMessage({
      text: 'biox.view_config_title_updated',
      translateText: true,
    });
    this.dialogRef.close(viewConfig);
    this.isLoading = false;
  }
}
