import { CdkScrollable } from '@angular/cdk/scrolling';
import { ChangeDetectionStrategy,Component, inject, OnInit } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogContent, MatDialogRef } from '@angular/material/dialog';
import { MatError, MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { FlCoreDirectiveModule } from '@monorepo/front-core-lib/fl-core-directive';
import { FlCorePipeModule } from '@monorepo/front-core-lib/fl-core-pipe';
import { FlDialogModule } from '@monorepo/front-core-lib/fl-dialog';
import { FlLoaderModule } from '@monorepo/front-core-lib/fl-loader';
import { FlSnackBarService } from '@monorepo/front-core-lib/fl-snack-bar';
import { LiResource, LiResourceService } from '@monorepo/lab-lib/li-core';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'li-update-resource-name-dialog',
  templateUrl: './li-update-resource-name-dialog.component.html',
  styleUrls: ['./li-update-resource-name-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
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
export class LiUpdateResourceNameDialogComponent implements OnInit {
  private resource = inject<LiResource>(MAT_DIALOG_DATA);
  private dialogRef = inject<MatDialogRef<LiUpdateResourceNameDialogComponent>>(MatDialogRef);
  private resourceService = inject(LiResourceService);
  private snackBarService = inject(FlSnackBarService);

  formCtrl: FormControl<string>;

  isLoading: boolean = false;

  ngOnInit(): void {
    this.formCtrl = new FormControl<string>(this.resource.name, [Validators.required]);
  }

  submit(): void {
    if (!this.isLoading && this.formCtrl.valid) {
      this.updateName(this.formCtrl.value);
    }
  }

  private updateName(name: string): void {
    this.isLoading = true;
    this.resourceService.updateName(this.resource.id, name).subscribe(
      (resource) => this.updateNameSuccess(resource),
      () => (this.isLoading = false)
    );
  }

  private updateNameSuccess(resource: LiResource): void {
    this.snackBarService.openSuccessMessage({ text: 'li.resource_name_updated', translateText: true });
    this.dialogRef.close(resource);
    this.isLoading = false;
  }
}
