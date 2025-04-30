import { Component, inject, OnInit } from '@angular/core';
import { FlDialogModule, FlFormDialogAbstractDirective } from '@monorepo/front-core-lib/fl-dialog';
import { FlFormDialogInput } from '@monorepo/front-core-lib/fl-core';
import { Observable } from 'rxjs';
import { CaFolderService } from '../../../../../ca-core/service-api/ca-folder.service';
import { FormBuilder, ReactiveFormsModule, UntypedFormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogContent } from '@angular/material/dialog';
import { MatError, MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { FlCoreDirectiveModule } from '@monorepo/front-core-lib/fl-core-directive';
import { MatButton } from '@angular/material/button';
import { FlLoaderModule } from '@monorepo/front-core-lib/fl-loader';
import { FlCorePipeModule } from '@monorepo/front-core-lib/fl-core-pipe';
import { TranslatePipe } from '@ngx-translate/core';

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
  styleUrls: ['./ca-document-name-form-dialog.component.scss'],
  imports: [
    FlDialogModule,
    MatDialogContent,
    ReactiveFormsModule,
    MatFormField,
    MatLabel,
    MatInput,
    FlCoreDirectiveModule,
    MatError,
    MatDialogActions,
    MatButton,
    FlLoaderModule,
    FlCorePipeModule,
    TranslatePipe,
  ],
})
export class CaDocumentNameFormDialogComponent
  extends FlFormDialogAbstractDirective<CaDocumentNameForm, any>
  implements OnInit
{
  private folderService = inject(CaFolderService);

  dialogInput: CaDocumentNameFormDialogInput = inject(MAT_DIALOG_DATA);

  constructor() {
    super();
  }

  ngOnInit(): void {
    this.init();
  }

  buildForm(): UntypedFormGroup {
    return new FormBuilder().group({
      name: [null, Validators.required],
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
