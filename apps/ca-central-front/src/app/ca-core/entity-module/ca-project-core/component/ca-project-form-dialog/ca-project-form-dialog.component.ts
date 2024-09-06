import { Component, inject, OnInit } from '@angular/core';
import { ValidatorFn, Validators } from '@angular/forms';
import { CaProject, CnSaveProjectDTO } from '../../../../model/entities/project/ca-project.class';
import { CaProjectService } from '../../../../service-api/ca-project.service';
import { FormBuilder, FormGroup } from '@ngneat/reactive-forms';
import { Observable } from 'rxjs';
import { FlFormDialogAbstractDirective, FlFormMode } from '@monorepo/front-core-lib';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CaSpaceService } from '../../../../service-api/ca-space.service';

export interface CaProjectFormDialogInput {
  mode: FlFormMode;
  projectId?: string; // only on update mode
  parentId?: string; // only on create mode
}

/**
 * Dialog to create or update a project
 */
@Component({
  selector: 'ca-project-form-dialog',
  templateUrl: './ca-project-form-dialog.component.html',
  styleUrls: ['./ca-project-form-dialog.component.scss']
})
export class CaProjectFormDialogComponent extends FlFormDialogAbstractDirective<CnSaveProjectDTO, CaProject> implements OnInit {

  dialogInput: CaProjectFormDialogInput = inject(MAT_DIALOG_DATA);

  formGp: FormGroup<CnSaveProjectDTO>;

  isLoading: boolean = false;

  constructor(private projectService: CaProjectService,
              private spaceService: CaSpaceService) {
    super();
  }

  async ngOnInit(): Promise<void> {
    this.init();

    if (this.showStorage) {
      this.spaceService.getCurrentSpaceSettings().subscribe(
        spaceSettings => {
          this.formGp.get('mainStorage').setValue(spaceSettings.defaultProjectStorageLocation);
          this.formGp.get('backupStorage').setValue(spaceSettings.defaultProjectBackupStorageLocation);
        }
      );
    }

    this.formGp.disable();
    if (this.isUpdateMode()) {
      this.projectService.getById(this.dialogInput.projectId).subscribe(
        project => {
          this.formGp.patchValue(project);
          this.formGp.enable();
        }
      );
    } else if (this.isCreateMode() && this.dialogInput.parentId) {
      // in create child mode, we copy the date from the parent project
      this.projectService.getById(this.dialogInput.parentId).subscribe(
        parentProject => {
          this.formGp.get('startingDate').setValue(parentProject.startingDate);
          this.formGp.get('endingDate').setValue(parentProject.endingDate);
          this.formGp.enable();
        }
      );
    } else {
      this.formGp.enable();
    }
  }

  buildForm(): FormGroup<CnSaveProjectDTO> {
    return new FormBuilder().group({
      title: [null, Validators.required],
      code: [null],
      startingDate: [null],
      endingDate: [null],
      mainStorage: [null, this.showStorage ? Validators.required : null],
      backupStorage: [null]
    }, { validator: this.showStorage ? this.differentStorageValidator() : null });
  }

  create(formValue: CnSaveProjectDTO): Observable<CaProject> {
    if (this.dialogInput.parentId) {
      return this.projectService.createSubProject(formValue, this.dialogInput.parentId);
    } else {
      return this.projectService.createProject(formValue);
    }
  }

  update(formValue: CnSaveProjectDTO): Observable<CaProject> {
    return this.projectService.update(this.dialogInput.projectId, formValue);
  }


  get title(): string {
    return this.isCreateMode() ? 'new_project' : 'update_project';
  }

  getCreateSuccessMessage(): string {
    return 'project_created';
  }

  getUpdateSuccessMessage(): string {
    return 'project_updated';
  }

  get showStorage(): boolean {
    return !this.dialogInput.parentId && this.isCreateMode();
  }

  private differentStorageValidator(): ValidatorFn {
    return (control: FormGroup<CnSaveProjectDTO>): { [key: string]: any } => {
      if (control.value.mainStorage == null || control.value.backupStorage == null) return null;

      if (control.value.mainStorage.bucketId === control.value.backupStorage.bucketId) {
        return { sameBackupStorage: true };
      }
      return null;
    };
  }
}
