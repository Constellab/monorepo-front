import { CdkScrollable } from '@angular/cdk/scrolling';
import { Component, OnInit, inject } from '@angular/core';
import { FlCorePipeModule } from '@monorepo/front-core-lib/fl-core-pipe';
import { FlDialogModule } from '@monorepo/front-core-lib/fl-dialog';
import { FlLoaderModule } from '@monorepo/front-core-lib/fl-loader';
import { FlSectionModule } from '@monorepo/front-core-lib/fl-section';
import { FlSnackBarService } from '@monorepo/front-core-lib/fl-snack-bar';
import { FormsModule, ReactiveFormsModule, UntypedFormControl, Validators } from '@angular/forms';
import {
  LiFileResourceService,
  LiResource,
  LiResourceService,
  LiTypeEntity,
} from '@monorepo/lab-lib/li-core';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogContent, MatDialogRef } from '@angular/material/dialog';
import { MatButton } from '@angular/material/button';
import { MatError, MatFormField, MatLabel } from '@angular/material/form-field';
import { MatOption } from '@angular/material/core';
import { MatSelect } from '@angular/material/select';
import { Observable } from 'rxjs';
import { TranslatePipe } from '@ngx-translate/core';

/**
 * Dialog to update the type of a file
 */
@Component({
  selector: 'li-update-resource-type',
  templateUrl: './li-update-resource-type.component.html',
  styleUrls: ['./li-update-resource-type.component.scss'],
  imports: [
    FlDialogModule,
    CdkScrollable,
    MatDialogContent,
    FlSectionModule,
    ReactiveFormsModule,
    FormsModule,
    MatFormField,
    MatLabel,
    MatSelect,
    MatOption,
    MatError,
    MatDialogActions,
    MatButton,
    FlLoaderModule,
    FlCorePipeModule,
    TranslatePipe,
  ],
})
export class LiUpdateResourceTypeComponent implements OnInit {
  private resource = inject<LiResource>(MAT_DIALOG_DATA);
  private dialogRef = inject<MatDialogRef<LiUpdateResourceTypeComponent>>(MatDialogRef);
  private labFileService = inject(LiFileResourceService);
  private resourceService = inject(LiResourceService);
  private snackBarService = inject(FlSnackBarService);

  formControl: UntypedFormControl;

  fsNodeTypes: Observable<LiTypeEntity[]>;

  isLoading: boolean = false;

  ngOnInit(): void {
    this.formControl = new UntypedFormControl(this.resource.resourceTypingName, [Validators.required]);

    if (this.resource.isFile()) {
      this.fsNodeTypes = this.labFileService.getFileTypes();
    } else {
      this.fsNodeTypes = this.labFileService.getFolderTypes();
    }
  }

  submit(): void {
    if (this.formControl.valid && !this.isLoading) {
      this.updateType(this.formControl.value);
    }
  }

  private updateType(type: string): void {
    this.isLoading = true;
    this.resourceService.updateResourceType(this.resource.id, type).subscribe(
      (resource) => this.updateTypeSuccess(resource),
      () => (this.isLoading = false)
    );
  }

  private updateTypeSuccess(resource: LiResource): void {
    this.snackBarService.openSuccessMessage({ text: 'biox.resource_type_updated', translateText: true });
    this.dialogRef.close(resource);
    this.isLoading = false;
  }
}
