import { Component, OnInit, inject } from '@angular/core';
import { LabResource } from '../../../../model/entities/resource/lab-resource.entity';
import { LabFileResourceService } from '../../../../entity-service/lab-file-resource.service';
import { UntypedFormControl, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { FlSnackBarService } from '@monorepo/front-core-lib/fl-snack-bar';
import { Observable } from 'rxjs';
import { LabTypeEntity } from '../../../../model/entities/lab-type/lab-type.entity';
import { LabResourceService } from '../../../../entity-service/lab-resource.service';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogContent, MatDialogActions } from '@angular/material/dialog';
import { FlDialogModule } from '@monorepo/front-core-lib/fl-dialog';
import { CdkScrollable } from '@angular/cdk/scrolling';
import { FlSectionModule } from '@monorepo/front-core-lib/fl-section';
import { MatFormField, MatLabel, MatError } from '@angular/material/form-field';
import { MatSelect } from '@angular/material/select';
import { MatOption } from '@angular/material/core';
import { MatButton } from '@angular/material/button';
import { FlLoaderModule } from '@monorepo/front-core-lib/fl-loader';
import { FlCorePipeModule } from '@monorepo/front-core-lib/fl-core-pipe';
import { TranslatePipe } from '@ngx-translate/core';

/**
 * Dialog to update the type of a file
 */
@Component({
  selector: 'lab-update-resource-type',
  templateUrl: './lab-update-resource-type.component.html',
  styleUrls: ['./lab-update-resource-type.component.scss'],
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
export class LabUpdateResourceTypeComponent implements OnInit {
  private resource = inject<LabResource>(MAT_DIALOG_DATA);
  private dialogRef = inject<MatDialogRef<LabUpdateResourceTypeComponent>>(MatDialogRef);
  private labFileService = inject(LabFileResourceService);
  private resourceService = inject(LabResourceService);
  private snackBarService = inject(FlSnackBarService);

  formControl: UntypedFormControl;

  fsNodeTypes: Observable<LabTypeEntity[]>;

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

  private updateTypeSuccess(resource: LabResource): void {
    this.snackBarService.openSuccessMessage({ text: 'biox.resource_type_updated', translateText: true });
    this.dialogRef.close(resource);
    this.isLoading = false;
  }
}
