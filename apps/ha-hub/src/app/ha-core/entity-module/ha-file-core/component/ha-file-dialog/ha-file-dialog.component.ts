import { Component, inject, OnInit } from '@angular/core';
import {
  FlFormDialogAbstractDirective,
  FlFormDialogInput,
  FlPortalAction,
  FlPortalActionsService
} from '@monorepo/front-core-lib';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { FormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ClHelpService } from '@monorepo/core-lib';
import { HaFileServiceInterface } from '../../model/ha-file-service.interface';
import { HaFile } from '../../model/ha-file';
import { HaBaseEntityWithFiles } from '../../model/ha-base-entity-with-files';

export type HaFileDialogInput = FlFormDialogInput<HaFileDialogObjectInput>;

export interface HaFileDialogObjectInput extends HaFileFormData {
  service: HaFileServiceInterface<HaBaseEntityWithFiles>;
}

export interface HaFileFormData {
  newFiles?: File[];
  entity: HaBaseEntityWithFiles;
}

@Component({
  selector: 'ha-file-dialog',
  templateUrl: './ha-file-dialog.component.html',
  styleUrls: ['./ha-file-dialog.component.scss']
})
export class HaFileDialogComponent extends FlFormDialogAbstractDirective<HaFileFormData, HaBaseEntityWithFiles> implements OnInit {

  dialogInput: HaFileDialogInput = inject(MAT_DIALOG_DATA);

  entity: HaBaseEntityWithFiles;

  constructor(private actionService: FlPortalActionsService) {
    super();
  }

  buildForm(): UntypedFormGroup {
    return new FormBuilder().group({
      newFiles: [null, Validators.required],
      entity: [this.entity, Validators.required]
    });
  }

  create(): Observable<HaBaseEntityWithFiles> {
    return undefined;
  }

  getCreateSuccessMessage(): string {
    return '';
  }

  getUpdateSuccessMessage(): string {
    return '';
  }

  update(): Observable<HaBaseEntityWithFiles> {
    return undefined;
  }

  uploadDocument(event: File | File[]): void {
    this.formGp.controls.newFiles?.patchValue(ClHelpService.convertObjectOrArrayToArray(event));

    if ((event as File[])[0].size > 20000000) {
      this.snackBarService.openErrorMessage({ text: 'file_too_large_error', translateText: true });
      return;
    }

    if (!this.formGp.controls.newFiles?.value) {
      return;
    }

    for (const file of this.formGp.controls.newFiles.value) {

      const action: FlPortalAction = {
        type: 'upload-document',
        action: this.dialogInput.object.service.uploadFile(file, this.entity.id),
        text: {
          text: 'uploading_document', translateText: true,
          translateParam: { param: { name: file.name } }
        },
        additionalInformation: this.entity.id
      };
      this.actionService.addAction(action, false);
    }
  }

  ngOnInit(): void {
    this.dialogInput.object.service.getById(this.dialogInput.object.entity.id).subscribe((entity) => {
      this.entity = entity;
    });
    this.formGp = this.buildForm();
    this.actionService.getResult$('upload-document').subscribe(action => {
      if (action?.status === 'success') {
        this.onDocumentUploaded(action.result, action.additionalInformation);
      }
    });
  }

  onDocumentUploaded(_: any, entityId: string): void {
    this.dialogInput.object.service.getById(entityId).subscribe((entity) => {
      this.entity = entity;
    });
  }

  deleteFile(file: HaFile): void {
    this.entity.files = this.entity.files.filter((entityFile) => entityFile.name !== file.name);

    const action: FlPortalAction = {
      type: 'delete-entity-document',
      action: this.dialogInput.object.service.deleteFile(this.entity.id, file.name),
      text: {
        text: 'deleting_document', translateText: true,
        translateParam: { param: { name: file.name } }
      },
      additionalInformation: this.entity.id
    };

    this.actionService.addAction(action, false);
  }

  renameFile(event: string, file: HaFile): void {
    this.dialogInput.object.service.renameFile(file.id, event).subscribe((entityFile: HaFile) => {
      if (entityFile) {
        this.entity.files = this.entity.files.map((entityFile) => {
          if (entityFile.id === file.id) {
            return entityFile;
          }
          return entityFile;
        });
      }
    });
  }
}
