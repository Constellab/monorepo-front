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
    console.log(input);
  }

  ngOnInit(): void {
    this.init();
  }

  buildForm(): FormGroup<CaProjectStorageDTO> {
    return new FormBuilder().group({
      mainRegion: [null, Validators.required],
      backupRegion: [null],
    }, {validator: this.differentBackupRegionValidator()});
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

  private differentBackupRegionValidator(): ValidatorFn {
    return (control: FormGroup<CaProjectStorageDTO>): { [key: string]: any } => {
      if (control.value.mainRegion == null || control.value.backupRegion == null) return null;

      if (control.value.mainRegion.id === control.value.backupRegion.id) {
        return {sameBackupRegion: true};
      }
      return null;
    };
  }


}
