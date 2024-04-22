import {Component, inject, OnInit} from '@angular/core';
import {ValidatorFn, Validators} from '@angular/forms';
import {
  CaProject,
  CaProjectLevel,
  CaProjectLevelStatus,
  CnSaveProjectDTO
} from '../../../../model/entities/project/ca-project.class';
import {CaProjectService} from '../../../../service-api/ca-project.service';
import {FormBuilder, FormGroup} from '@ngneat/reactive-forms';
import {Observable} from 'rxjs';
import {FlFormDialogAbstractDirective, FlFormDialogInput,} from '@monorepo/front-core-lib';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';
import {CaSpaceService} from '../../../../service-api/ca-space.service';
import {DateTime} from 'luxon';
import {
  CaTextEditorBasicConfig
} from '../../../../../ca-project/module/ca-text-editor/model/ca-text-editor-basic-config.class';
import {CaTextEditorConfig} from '../../../../../ca-project/module/ca-text-editor/model/ca-text-editor-config.class';

export interface CaProjectFormDialogInput extends FlFormDialogInput<CaProject> {
  level: CaProjectLevel;
  parentId?: string;
  parentLevel?: CaProjectLevel;
  parentStartingDate?: DateTime;
  parentEndingDate?: DateTime;
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

  textEditorConfig: CaTextEditorConfig = new CaTextEditorBasicConfig();

  levelStatus = CaProjectLevelStatus;

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
          this.formGp.get('backupStorage').setValue(spaceSettings.defaultBackupProjectStorageLocation);
        }
      );
    }
  }

  buildForm(): FormGroup<CnSaveProjectDTO> {
    return new FormBuilder().group({
      levelStatus: [
        {
          value: CaProjectLevelStatus.LEAF,
          // when work package we force the children to be leaf to limit hierarchy depth
          disabled: this.isUpdateMode() || !this.allowParent
        }
        , Validators.required],
      code: [null, Validators.required],
      title: [null, Validators.required],
      startingDate: [this.dialogInput.parentStartingDate, Validators.required],
      endingDate: [this.dialogInput.parentEndingDate],
      mainStorage: [null, this.showStorage ? Validators.required : null],
      backupStorage: [null],
    }, {validator: this.showStorage ? this.differentStorageValidator() : null});
  }

  create(formValue: CnSaveProjectDTO): Observable<CaProject> {
    if (this.dialogInput.level === CaProjectLevel.PROJECT) {
      return this.projectService.createProject(formValue);
    } else {
      return this.projectService.createSubProject(formValue, this.dialogInput.parentId);
    }
  }

  update(formValue: CnSaveProjectDTO): Observable<CaProject> {
    return this.projectService.update(this.dialogInput.object.id, formValue);
  }


  get title(): string {
    if (this.dialogInput.level === CaProjectLevel.PROJECT) {
      return this.isCreateMode() ? 'new_project' : 'update_project';
    } else {
      return this.isCreateMode() ? 'new_sub_project' : 'update_sub_project';
    }
  }

  getCreateSuccessMessage(): string {
    if (this.dialogInput.level === CaProjectLevel.PROJECT) {
      return 'project_created';
    } else {
      return 'sub_project_created';
    }
  }

  getUpdateSuccessMessage(): string {
    if (this.dialogInput.level === CaProjectLevel.PROJECT) {
      return 'project_updated';
    } else {
      return 'sub_project_updated';
    }
  }

  // return true if we can create a parent project, false if the hierarchy reached the max depth
  get allowParent(): boolean {
    return this.dialogInput.parentLevel == null || this.dialogInput.parentLevel < CaProjectLevel.MAX_LEVEL - 1;
  }

  get showStorage(): boolean {
    return this.dialogInput.level === CaProjectLevel.PROJECT && this.isCreateMode();
  }

  private differentStorageValidator(): ValidatorFn {
    return (control: FormGroup<CnSaveProjectDTO>): { [key: string]: any } => {
      if (control.value.mainStorage == null || control.value.backupStorage == null) return null;

      if (control.value.mainStorage.bucketId === control.value.backupStorage.bucketId) {
        return {sameBackupStorage: true};
      }
      return null;
    };
  }
}
