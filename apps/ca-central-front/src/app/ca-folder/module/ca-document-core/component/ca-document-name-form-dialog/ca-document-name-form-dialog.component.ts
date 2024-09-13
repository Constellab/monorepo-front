import {Component, inject, OnInit} from '@angular/core';
import {FlFormDialogAbstractDirective, FlFormDialogInput} from '@monorepo/front-core-lib';
import {FormBuilder, FormGroup} from '@ngneat/reactive-forms';
import {Observable} from 'rxjs';
import {CaFolderService} from '../../../../../ca-core/service-api/ca-folder.service';
import {Validators} from '@angular/forms';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';

interface CaDocumentNameForm {
  name: string;
}

export interface CaDocumentNameFormDialogInput extends FlFormDialogInput<CaDocumentNameForm> {
  parentFolderId?: string; // mode create
  documentId?: string; // mode update
}

/**
 * Dialog to create a constellab document (in create mode)
 * In update mode it rename a constellab document or a folder document
 */
@Component({
  selector: 'ca-document-name-form-dialog',
  templateUrl: './ca-document-name-form-dialog.component.html',
  styleUrls: ['./ca-document-name-form-dialog.component.scss']
})
export class CaDocumentNameFormDialogComponent extends FlFormDialogAbstractDirective<CaDocumentNameForm, any>
  implements OnInit {

  dialogInput: CaDocumentNameFormDialogInput = inject(MAT_DIALOG_DATA);


  constructor(private folderService: CaFolderService) {
    super();
  }

  ngOnInit(): void {
    this.init();
  }

  buildForm(): FormGroup<CaDocumentNameForm> {
    return new FormBuilder().group({
      name: [null, Validators.required]
    });
  }

  create(formValue: CaDocumentNameForm): Observable<any> {
    return this.folderService.createConstellabDocument(this.dialogInput.parentFolderId, formValue.name);
  }

  getCreateSuccessMessage(): string {
    return 'document_created';
  }

  getUpdateSuccessMessage(): string {
    return 'document_renamed';
  }

  update(formValue: { name: string }): Observable<any> {
    return this.folderService.renameDocument(this.dialogInput.documentId, formValue.name);
  }

  get title(): string {
    return this.isUpdateMode() ? 'rename_document' : 'create_constellab_document';
  }


}
