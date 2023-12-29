import {Component, Inject, OnInit} from '@angular/core';
import {FlFormDialogAbstractDirective, FlFormDialogInput, FlSnackBarService} from '@monorepo/front-core-lib';
import {HaCreateLiveTaskDto, HaLiveTask} from '../../../ha-core/ha-model/ha-entities/ha-live-task.class';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {FormBuilder, FormGroup} from '@ngneat/reactive-forms';
import {Validators} from '@angular/forms';
import {Observable} from 'rxjs';
import {HaLiveTaskService} from '../../../ha-core/ha-service/ha-live-task.service';
import {HaSpace} from '../../../ha-core/ha-model/ha-entities/ha-space.class';
import {HaSpaceService} from '../../../ha-core/ha-service/ha-space.service';
import {HaAuthenticatedUserService} from '../../../ha-core/ha-service/ha-authenticated-user.service';
import {
  HaLiveTaskVersion,
  HaLiveTaskVersionFileInput
} from '../../../ha-core/ha-model/ha-entities/ha-live-task-version.class';

export type HaCreateLiveTaskInput = FlFormDialogInput<HaCreateLiveTaskDto>;

@Component({
  selector: 'ha-live-task-create-dialog',
  templateUrl: './ha-live-task-create-dialog.component.html',
  styleUrls: ['./ha-live-task-create-dialog.component.scss'],
})
export class HaLiveTaskCreateDialogComponent extends FlFormDialogAbstractDirective<HaCreateLiveTaskDto, HaLiveTaskVersion> implements OnInit {

  userSpaces$: Observable<HaSpace[]>;
  inputFile: any;

  constructor(snackBarService: FlSnackBarService,
              dialogRef: MatDialogRef<HaLiveTaskCreateDialogComponent>,
              @Inject(MAT_DIALOG_DATA) dialogInput: HaCreateLiveTaskInput,
              private liveTaskService: HaLiveTaskService,
              private spaceService: HaSpaceService,
              private authenticatedUserService: HaAuthenticatedUserService) {
    super(dialogInput, snackBarService, dialogRef);
  }

  ngOnInit(): void {
    this.userSpaces$ = this.spaceService.getSpacesOfCurrentUser();

    this.init();
  }

  buildForm(): FormGroup<HaCreateLiveTaskDto> {
    return new FormBuilder().group({
      title: [null, Validators.required],
      type: [null, Validators.required],
      versionFile: [null, Validators.required],
      space: [null]
    })
  }

  create(formValue: HaCreateLiveTaskDto): Observable<HaLiveTaskVersion> {
    return this.liveTaskService.create(formValue);
  }

  update(formValue: HaCreateLiveTaskDto): Observable<HaLiveTaskVersion> {
    throw new Error('Method not implemented.');
  }

  getCreateSuccessMessage(): string {
    return 'create_live_task_success';
  }

  getUpdateSuccessMessage(): string {
    throw new Error('Method not implemented.');
  }

  onFileSelected(event: any): void {
    this.inputFile = null;
    this.formGp.controls.versionFile.patchValue(null);
    if (event == null) {
      return;
    }
    if (!event.name.endsWith('.json')) {
      this.snackBarService.openErrorMessage({text: 'file_wrong_type', translateText: true});
      return;
    }

    if (typeof (FileReader) !== 'undefined') {
      const reader = new FileReader();

      reader.onload = (e: any) => {
        const srcResult: HaLiveTaskVersionFileInput = JSON.parse(e.target.result);
        if(!HaLiveTaskVersionFileInput.isValid(srcResult)){
          this.snackBarService.openErrorMessage({text: 'file_wrong_format', translateText: true});
          return;
        }
        this.formGp.controls.versionFile.patchValue(srcResult);
      }

      reader.readAsText(event);
    }
  }
}
