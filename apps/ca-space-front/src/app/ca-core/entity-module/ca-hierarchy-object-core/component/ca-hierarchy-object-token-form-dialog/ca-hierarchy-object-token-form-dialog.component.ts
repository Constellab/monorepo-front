import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, UntypedFormGroup } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FlFormDialogInput } from '@monorepo/front-core-lib/fl-core';
import { FlDialogModule, FlFormDialogAbstractDirective } from '@monorepo/front-core-lib/fl-dialog';
import { FlLoaderModule } from '@monorepo/front-core-lib/fl-loader';
import { FlTranslateModule } from '@monorepo/front-core-lib/fl-translate';
import { Observable } from 'rxjs';

import {
  CaHierarchyObjectToken,
  CaHierarchyObjectTokenSaveDTO,
} from '../../../../model/entities/folder/ca-hierarchy-object-token.class';
import { CaHierarchyObjectTokenService } from '../../../../service-api/ca-hierarchy-object-token.service';

export type CaHierarchyObjectTokenFormDialogInput = FlFormDialogInput<CaHierarchyObjectTokenSaveDTO> & {
  hierarchyObjectId?: string; // in create mode
  hierarchyObjectTokenId?: string; // in update mode
};

/**
 * Dialog to create and update a hierarchy object token
 */
@Component({
  selector: 'ca-hierarchy-object-token-form-dialog',
  imports: [
    FlDialogModule,
    FlLoaderModule,
    MatButton,
    MatDatepickerModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    FlTranslateModule,
    MatInputModule,
  ],
  templateUrl: './ca-hierarchy-object-token-form-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './ca-hierarchy-object-token-form-dialog.component.scss',
})
export class CaHierarchyObjectTokenFormDialogComponent
  extends FlFormDialogAbstractDirective<CaHierarchyObjectTokenSaveDTO, CaHierarchyObjectToken>
  implements OnInit
{
  dialogInput: CaHierarchyObjectTokenFormDialogInput = inject(MAT_DIALOG_DATA);

  private hierarchyObjectTokenService = inject(CaHierarchyObjectTokenService);

  ngOnInit(): void {
    this.init();
  }

  buildForm(): UntypedFormGroup {
    return new FormBuilder().group({
      expirationDate: [null],
    });
  }

  create(formValue: CaHierarchyObjectTokenSaveDTO): Observable<CaHierarchyObjectToken> {
    const hierarchyObjectId = this.dialogInput.hierarchyObjectId;
    if (hierarchyObjectId == null) {
      throw new Error('CaHierarchyObjectTokenFormDialogComponent: missing hierarchyObjectId in create mode');
    }
    return this.hierarchyObjectTokenService.createToken(hierarchyObjectId, formValue);
  }

  getCreateSuccessMessage(): string {
    return 'hierarchy_object_token_created';
  }

  getUpdateSuccessMessage(): string {
    return 'hierarchy_object_token_updated';
  }

  update(formValue: CaHierarchyObjectTokenSaveDTO): Observable<CaHierarchyObjectToken> {
    const hierarchyObjectTokenId = this.dialogInput.hierarchyObjectTokenId;
    if (hierarchyObjectTokenId == null) {
      throw new Error(
        'CaHierarchyObjectTokenFormDialogComponent: missing hierarchyObjectTokenId in update mode'
      );
    }
    return this.hierarchyObjectTokenService.updateToken(hierarchyObjectTokenId, formValue);
  }

  get title(): string {
    return this.isCreateMode() ? 'hierarchy_object_token_create' : 'hierarchy_object_token_update';
  }
}
