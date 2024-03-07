import {
  FlFormDialogAbstractDirective,
  FlFormDialogInput,
  FlPortalAction,
  FlPortalActionsService,
  FlSnackBarService,
  FlTranslateService
} from '@monorepo/front-core-lib';
import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {FormBuilder, FormGroup} from '@ngneat/reactive-forms';
import {Validators} from '@angular/forms';
import {Observable} from 'rxjs';
import {ClHelpService} from '@monorepo/core-lib';
import {HaFile} from '../../../../ha-core/ha-model/ha-entities/ha-file';
import {HaFileHelper} from '../../../../ha-core/ha-helper/ha-file.helper';
import {HaDocumentation} from '../../../../ha-core/ha-model/ha-entities/ha-documentation.class';
import {HaDocumentationService} from '../../../../ha-core/ha-service/ha-documentation.service';

export type HaDocFileDialogInput = FlFormDialogInput<HaDocFileFormData>;

export interface HaDocFileFormData {
  newDocFiles?: File[];
  doc: HaDocumentation;
}

@Component({
  selector: 'ha-public-doc-file-dialog',
  templateUrl: './ha-public-doc-file-dialog.component.html',
  styleUrls: ['./ha-public-doc-file-dialog.component.scss'],
})
export class HaDocFileDialogComponent extends FlFormDialogAbstractDirective<HaDocFileFormData, HaDocumentation> implements OnInit {

  doc: HaDocumentation;
  docId: string

  constructor(snackBarService: FlSnackBarService,
              dialogRef: MatDialogRef<HaDocFileDialogComponent>,
              @Inject(MAT_DIALOG_DATA) dialogInput: HaDocFileDialogInput,
              private docService: HaDocumentationService,
              private translateService: FlTranslateService,
              private actionService: FlPortalActionsService) {
    super(dialogInput, snackBarService, dialogRef);
    this.docId = dialogInput.object.doc.id;
  }

  buildForm(): FormGroup<HaDocFileFormData> {
    return new FormBuilder().group({
      newDocFiles: [null, Validators.required],
      doc: [this.doc, Validators.required]
    });
  }

  create(formValue: HaDocFileFormData): Observable<HaDocumentation> {
    return undefined;
  }

  getCreateSuccessMessage(): string {
    return '';
  }

  getUpdateSuccessMessage(): string {
    return '';
  }

  update(formValue: HaDocFileFormData): Observable<HaDocumentation> {
    return undefined;
  }

  uploadDocument(event: File | File[]): void {
    this.formGp.controls.newDocFiles.patchValue(ClHelpService.convertObjectOrArrayToArray(event));

    for (const file of this.formGp.controls.newDocFiles.value) {

      const action: FlPortalAction = {
        type: 'upload-story-document',
        action: this.docService.uploadDocument(file, this.doc.id),
        text: this.translateService.translate('uploading_document',
          {param: {name: file.name}}),
        additionalInformation: this.doc.id
      };

      this.actionService.addAction(action, false);
    }
  }

  ngOnInit(): void {
    this.docService.getById(this.docId).subscribe((story) => {
      this.doc = story;
    })
    this.formGp = this.buildForm();
    this.actionService.getResult$('upload-story-document').subscribe(action => {
      if (action?.status === 'success') {
        this.onDocumentUploaded(action.result, action.additionalInformation);
      }
    });
  }

  onDocumentUploaded(result: any, storyId: string): void {
    this.docService.getById(storyId).subscribe((story) => {
      this.doc = story;
    });
  }

  deleteFile(file: HaFile): void {
    this.doc.docFiles = this.doc.docFiles.filter((docFile) => docFile.id !== file.id);

    const action: FlPortalAction = {
      type: 'delete-story-document',
      action: this.docService.deleteDocFile(file.id),
      text: this.translateService.translate('deleting_document',
        {param: {name: file.humanName}}),
      additionalInformation: this.doc.id
    };

    this.actionService.addAction(action, false);
  }

  renameFile(event: string, file: HaFile): void {
    this.docService.renameDocFile(file.id, event).subscribe((docFile: HaFile) => {
      if (docFile) {
        this.doc.docFiles = this.doc.docFiles.map((docFile) => {
          if (docFile.id === file.id) {
            return docFile;
          }
          return docFile;
        });
      }
    });
  }

  getFileIcon(humanName: string): string {
    return HaFileHelper.getFileIcon(humanName);
  }
}
