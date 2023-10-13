import {Component, Inject, OnInit} from '@angular/core';
import {FlFormDialogAbstractDirective, FlFormDialogInput, FlSnackBarService} from '@monorepo/front-core-lib';
import {CaProjectService} from '../../../../../ca-core/service-api/ca-project.service';
import {Observable} from 'rxjs';
import {FormBuilder, FormGroup} from '@ngneat/reactive-forms';
import {ValidatorFn, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {
  CaCreateProjectBucketDTO,
  CaProjectBucketsDTO
} from '../../../../../ca-core/model/entities/project/ca-project.class';


export interface CaProjectConfigureStorageInput extends FlFormDialogInput<CaCreateProjectBucketDTO> {
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
  extends FlFormDialogAbstractDirective<CaCreateProjectBucketDTO, CaProjectBucketsDTO>
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

  buildForm(): FormGroup<CaCreateProjectBucketDTO> {
    return new FormBuilder().group({
      mainRegion: [null, Validators.required],
      backupRegion: [null, [Validators.required]],
    }, {validator: this.differentBackupRegionValidator()});
  }

  create(formValue: CaCreateProjectBucketDTO): Observable<CaProjectBucketsDTO> {
    return this.projectService.createProjectBuckets(this.input.projectId, formValue);
  }

  getCreateSuccessMessage(): string {
    return 'project_storage_configured';
  }

  // Update is not supported
  getUpdateSuccessMessage(): string {
    return '';
  }

  update(): Observable<CaProjectBucketsDTO> {
    return undefined;
  }

  private differentBackupRegionValidator(): ValidatorFn {
    return (control: FormGroup<CaCreateProjectBucketDTO>): { [key: string]: any } => {
      if (control.value.mainRegion == null || control.value.backupRegion == null) return null;

      if (control.value.mainRegion.id === control.value.backupRegion.id) {
        return {sameBackupRegion: true};
      }
      return null;
    };
  }


}
