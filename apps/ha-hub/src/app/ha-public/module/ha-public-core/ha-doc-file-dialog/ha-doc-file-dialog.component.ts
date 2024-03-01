import {Component, Inject, OnInit} from '@angular/core';
import {
  FlFormDialogAbstractDirective,
  FlFormDialogInput, FlPortalAction, FlPortalActionsService,
  FlSnackBarService, FlTranslateService
} from '@monorepo/front-core-lib';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {FormBuilder, FormGroup} from '@ngneat/reactive-forms';
import {Observable} from 'rxjs';
import {Validators} from '@angular/forms';
import {ClHelpService} from '@monorepo/core-lib';
import {HaDocumentation} from '../../../../ha-core/ha-model/ha-entities/ha-documentation.class';
import {HaDocumentationService} from '../../../../ha-core/ha-service/ha-documentation.service';
import {HaFile} from '../../../../ha-core/ha-model/ha-entities/ha-file';
import {HaFileHelper} from '../../../../ha-core/ha-helper/ha-file.helper';

export type HaStoryFileDialogInput = FlFormDialogInput<HaStoryFileFormData>;

export interface HaStoryFileFormData {
  newDocFiles?: File[];
  doc: HaDocumentation;
}

@Component({
  selector: 'ha-doc-file-dialog',
  templateUrl: './ha-doc-file-dialog.component.html',
  styleUrls: ['./ha-doc-file-dialog.component.scss'],
})
export class HaDocFileDialogComponent extends FlFormDialogAbstractDirective<HaStoryFileFormData, HaDocumentation> implements OnInit {

  doc: HaDocumentation;
  docId: string

  constructor(snackBarService: FlSnackBarService,
              dialogRef: MatDialogRef<HaDocFileDialogComponent>,
              @Inject(MAT_DIALOG_DATA) dialogInput: HaStoryFileDialogInput,
              private documentationService: HaDocumentationService,
              private translateService: FlTranslateService,
              private actionService: FlPortalActionsService) {
    super(dialogInput, snackBarService, dialogRef);
    this.docId = dialogInput.object.doc.id;
  }

  buildForm(): FormGroup<HaStoryFileFormData> {
    return new FormBuilder().group({
      newDocFiles: [null, Validators.required],
      doc: [this.doc, Validators.required]
    });
  }

  create(formValue: HaStoryFileFormData): Observable<HaDocumentation> {
    return undefined;
  }

  getCreateSuccessMessage(): string {
    return '';
  }

  getUpdateSuccessMessage(): string {
    return '';
  }

  update(formValue: HaStoryFileFormData): Observable<HaDocumentation> {
    return undefined;
  }

  uploadDocument(event: File | File[]): void{
    this.formGp.controls.newDocFiles.patchValue(ClHelpService.convertObjectOrArrayToArray(event));

    for (const file of this.formGp.controls.newDocFiles.value) {

      const action: FlPortalAction = {
        type: 'upload-doc-document',
        action: this.documentationService.uploadDocument(file, this.doc.id),
        text: this.translateService.translate('uploading_document',
          {param: {name: file.name}}),
        additionalInformation: this.doc.id
      };

      this.actionService.addAction(action, false);
    }
  }

  ngOnInit(): void {
    this.documentationService.getById(this.docId).subscribe((doc) => {
      this.doc = doc;
    })
    this.formGp = this.buildForm();
    this.actionService.getResult$('upload-doc-document').subscribe(action => {
      if (action?.status === 'success') {
        this.onDocumentUploaded(action.result, action.additionalInformation);
      }
    });
  }

  onDocumentUploaded(result: any, storyId: string): void {
    this.documentationService.getById(storyId).subscribe((doc) => {
      this.doc = doc;
    });
  }

  deleteFile(file: HaFile): void{
    this.doc.docFiles = this.doc.docFiles.filter((docFile) => docFile.id !== file.id);

    const action: FlPortalAction = {
      type: 'delete-doc-document',
      action: this.documentationService.deleteDocFile(file.id),
      text: this.translateService.translate('deleting_document',
        {param: {name: file.humanName}}),
      additionalInformation: this.doc.id
    };

    this.actionService.addAction(action, false);
  }

  renameFile(event: string, file: HaFile): void{
    this.documentationService.renameDocFile(file.id, event).subscribe((file: HaFile) => {
      if(file){
        this.doc.docFiles = this.doc.docFiles.map((docFile) => {
          if(docFile.id === file.id){
            return docFile;
          }
          return docFile;
        });
      }
    });
  }

  getFileIcon(humanName: string): string{
    return HaFileHelper.getFileIcon(humanName);
  }

}
