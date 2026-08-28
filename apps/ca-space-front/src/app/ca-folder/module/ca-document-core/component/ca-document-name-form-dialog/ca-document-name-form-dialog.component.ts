import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, UntypedFormGroup, Validators } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogContent } from '@angular/material/dialog';
import { MatError, MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { FlFormDialogInput } from '@monorepo/front-core-lib/fl-core';
import { FlCoreDirectiveModule } from '@monorepo/front-core-lib/fl-core-directive';
import { FlCorePipeModule } from '@monorepo/front-core-lib/fl-core-pipe';
import { FlDialogModule, FlFormDialogAbstractDirective } from '@monorepo/front-core-lib/fl-dialog';
import { FlLoaderModule } from '@monorepo/front-core-lib/fl-loader';
import { TranslatePipe } from '@ngx-translate/core';
import { Observable } from 'rxjs';

import { CaConstellabDocumentService } from '../../../../../ca-core/service-api/ca-constellab-document.service';
import { CaDocumentService } from '../../../../../ca-core/service-api/ca-document.service';

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
  changeDetection: ChangeDetectionStrategy.Eager,
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
  private constellabDocumentService = inject(CaConstellabDocumentService);
  private documentService = inject(CaDocumentService);

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
    const parentFolderId = this.dialogInput.parentFolderId;
    if (parentFolderId == null) {
      throw new Error('CaDocumentNameFormDialogComponent: missing parentFolderId in create mode');
    }
    return this.constellabDocumentService.createConstellabDocument(parentFolderId, formValue.name);
  }

  getCreateSuccessMessage(): string {
    return 'document_created';
  }

  getUpdateSuccessMessage(): string {
    return 'document_renamed';
  }

  update(formValue: { name: string }): Observable<any> {
    const documentId = this.dialogInput.documentId;
    if (documentId == null) {
      throw new Error('CaDocumentNameFormDialogComponent: missing documentId in update mode');
    }
    return this.documentService.renameDocument(documentId, formValue.name);
  }

  get title(): string {
    return this.isUpdateMode() ? 'rename_document' : 'create_constellab_document';
  }
}
