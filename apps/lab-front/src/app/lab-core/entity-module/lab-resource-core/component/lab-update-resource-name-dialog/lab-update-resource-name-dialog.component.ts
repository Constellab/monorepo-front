import { Component, OnInit, inject } from '@angular/core';
import { LabResource } from '../../../../model/entities/resource/lab-resource.entity';
import { LabResourceService } from '../../../../entity-service/lab-resource.service';
import { FlSnackBarService } from '@monorepo/front-core-lib';
import { FormControl, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogContent, MatDialogActions } from '@angular/material/dialog';
import { FlDialogModule } from '../../../../../../../../../libs/front-core-lib/src/lib/module/fl-dialog/fl-dialog.module';
import { CdkScrollable } from '@angular/cdk/scrolling';
import { MatFormField, MatLabel, MatError } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { FlCoreDirectiveModule } from '../../../../../../../../../libs/front-core-lib/src/lib/module/fl-core-directive/fl-core-directive.module';
import { MatButton } from '@angular/material/button';
import { FlLoaderModule } from '../../../../../../../../../libs/front-core-lib/src/lib/module/fl-loader/fl-loader.module';
import { FlCorePipeModule } from '../../../../../../../../../libs/front-core-lib/src/lib/module/fl-core-pipe/fl-core-pipe.module';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'lab-update-resource-name-dialog',
  templateUrl: './lab-update-resource-name-dialog.component.html',
  styleUrls: ['./lab-update-resource-name-dialog.component.scss'],
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
export class LabUpdateResourceNameDialogComponent implements OnInit {
  private resource = inject<LabResource>(MAT_DIALOG_DATA);
  private dialogRef = inject<MatDialogRef<LabUpdateResourceNameDialogComponent>>(MatDialogRef);
  private resourceService = inject(LabResourceService);
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

  private updateNameSuccess(resource: LabResource): void {
    this.snackBarService.openSuccessMessage({ text: 'biox.resource_name_updated', translateText: true });
    this.dialogRef.close(resource);
    this.isLoading = false;
  }
}
