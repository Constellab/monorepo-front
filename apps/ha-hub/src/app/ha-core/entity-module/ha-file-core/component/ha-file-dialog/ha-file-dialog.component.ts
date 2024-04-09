import {Component, Inject, OnInit} from '@angular/core';
import {
  FlFormDialogAbstractDirective,
  FlFormDialogInput,
  FlPortalAction,
  FlPortalActionsService,
  FlSnackBarService,
  FlTranslateService
} from '@monorepo/front-core-lib';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {FormBuilder, FormGroup} from '@ngneat/reactive-forms';
import {Observable} from 'rxjs';
import {Validators} from '@angular/forms';
import {ClHelpService} from '@monorepo/core-lib';
import {HaFileServiceInterface} from '../../model/ha-file-service.interface';
import {HaFile} from '../../model/ha-file';
import {HaBaseEntityWithFiles} from '../../model/ha-base-entity-with-files';

export type HaFileDialogInput = FlFormDialogInput<HaFileDialogObjectInput>;

export interface HaFileDialogObjectInput extends HaFileFormData{
  service: HaFileServiceInterface<HaBaseEntityWithFiles>
}

export interface HaFileFormData {
  newFiles?: File[];
  entity: HaBaseEntityWithFiles;
}

@Component({
  selector: 'ha-file-dialog',
  templateUrl: './ha-file-dialog.component.html',
  styleUrls: ['./ha-file-dialog.component.scss'],
})
export class HaFileDialogComponent extends FlFormDialogAbstractDirective<HaFileFormData, HaBaseEntityWithFiles> implements OnInit {

  entity: HaBaseEntityWithFiles;
  service: HaFileServiceInterface<HaBaseEntityWithFiles>
  entityId: string

  constructor(snackBarService: FlSnackBarService,
              dialogRef: MatDialogRef<HaFileDialogComponent>,
              @Inject(MAT_DIALOG_DATA) dialogInput: HaFileDialogInput,
              private translateService: FlTranslateService,
              private actionService: FlPortalActionsService) {
    super(dialogInput, snackBarService, dialogRef);
    this.entityId = dialogInput.object.entity.id;
    this.service = dialogInput.object.service;
  }

  buildForm(): FormGroup<HaFileFormData> {
    return new FormBuilder().group({
      newFiles: [null, Validators.required],
      entity: [this.entity, Validators.required]
    });
  }

  create(formValue: HaFileFormData): Observable<HaBaseEntityWithFiles> {
    return undefined;
  }

  getCreateSuccessMessage(): string {
    return '';
  }

  getUpdateSuccessMessage(): string {
    return '';
  }

  update(formValue: HaFileFormData): Observable<HaBaseEntityWithFiles> {
    return undefined;
  }

  uploadDocument(event: File | File[]): void{
    this.formGp.controls.newFiles?.patchValue(ClHelpService.convertObjectOrArrayToArray(event));

    console.log('SIZE', (event as File))
    if(event[0].size > 20000000){
      this.snackBarService.openErrorMessage({text: 'file_too_large_error', translateText: true});
      return;
    }

    if (!this.formGp.controls.newFiles?.value) {
      return;
    }

    for (const file of this.formGp.controls.newFiles.value) {

      const action: FlPortalAction = {
        type: 'upload-document',
        action: this.service.uploadFile(file, this.entity.id),
        text: this.translateService.translate('uploading_document',
          {param: {name: file.name}}),
        additionalInformation: this.entity.id
      };
      this.actionService.addAction(action, false);
    }
  }

  ngOnInit(): void {
    this.service.getById(this.entityId).subscribe((entity) => {
      this.entity = entity;
    })
    this.formGp = this.buildForm();
    this.actionService.getResult$('upload-document').subscribe(action => {
      if (action?.status === 'success') {
        this.onDocumentUploaded(action.result, action.additionalInformation);
      }
    });
  }

  onDocumentUploaded(result: any, entityId: string): void {
    this.service.getById(entityId).subscribe((entity) => {
      this.entity = entity;
    });
  }

  deleteFile(file: HaFile): void{
    this.entity.files = this.entity.files.filter((entityFile) => entityFile.id !== file.id);

    const action: FlPortalAction = {
      type: 'delete-entity-document',
      action: this.service.deleteFile(file.id),
      text: this.translateService.translate('deleting_document',
        {param: {name: file.humanName}}),
      additionalInformation: this.entity.id
    };

    this.actionService.addAction(action, false);
  }

  renameFile(event: string, file: HaFile): void{
    this.service.renameFile(file.id, event).subscribe((entityFile: HaFile) => {
      if(entityFile){
        this.entity.files = this.entity.files.map((entityFile) => {
          if(entityFile.id === file.id){
            return entityFile;
          }
          return entityFile;
        });
      }
    });
  }
}
