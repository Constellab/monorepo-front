import {Component, Inject, OnInit} from '@angular/core';
import {FlFormDialogAbstractDirective, FlFormDialogInput, FlSnackBarService} from '@monorepo/front-core-lib';
import {CaProjectService} from '../../../../../ca-core/service-api/ca-project.service';
import {Observable} from 'rxjs';
import {FormBuilder, FormGroup} from '@ngneat/reactive-forms';
import {ValidatorFn, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {CaProjectStorageDTO} from '../../../../../ca-core/model/entities/project/ca-project.class';


export interface CaProjectConfigureStorageInput extends FlFormDialogInput<CaProjectStorageDTO> {
  projectId: string;
}

/**
 * Dialog to configure the storage for a project
 */
@Component({
  selector: 'ca-project-configure-storage',
  templateUrl: './ca-project-configure-storage.component.html',
  styleUrls: ['./ca-project-configure-storage.component.scss']
})
export class CaProjectConfigureStorageComponent
  extends FlFormDialogAbstractDirective<CaProjectStorageDTO>
  implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) private input: CaProjectConfigureStorageInput,
              dialogRef: MatDialogRef<CaProjectConfigureStorageComponent>,
              snackBarService: FlSnackBarService,
              private projectService: CaProjectService) {
    super(input, snackBarService, dialogRef);
  }

  ngOnInit(): void {
    this.init();
  }

  buildForm(): FormGroup<CaProjectStorageDTO> {
    return new FormBuilder().group({
      mainStorage: [{value: null, disabled: this.input.object.mainStorage != null}, Validators.required],
      backupStorage: [{value: null, disabled: this.input.object.backupStorage != null}],
    }, {validator: this.differentBackupStorageValidator()});
  }

  create(): Observable<CaProjectStorageDTO> {
    return undefined;
  }

  getCreateSuccessMessage(): string {
    return '';
  }

  // Update is not supported
  getUpdateSuccessMessage(): string {
    return 'project_storage_configured';
  }

  update(formValue: CaProjectStorageDTO): Observable<CaProjectStorageDTO> {
    return this.projectService.createProjectBuckets(this.input.projectId, formValue);
  }

  private differentBackupStorageValidator(): ValidatorFn {
    return (control: FormGroup<CaProjectStorageDTO>): { [key: string]: any } => {
      if (control.value.mainStorage == null || control.value.backupStorage == null) return null;

      if (control.value.mainStorage.bucketId === control.value.backupStorage.bucketId) {
        return {sameBackupStorage: true};
      }
      return null;
    };
  }


}
