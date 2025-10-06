import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, UntypedFormGroup, Validators } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatDialogActions, MatDialogContent } from '@angular/material/dialog';
import { MatError, MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatRadioButton, MatRadioGroup } from '@angular/material/radio';
import { FlCoreDirectiveModule } from '@monorepo/front-core-lib/fl-core-directive';
import { FlCorePipeModule } from '@monorepo/front-core-lib/fl-core-pipe';
import { FlDialogModule, FlFormDialogAbstractDirective } from '@monorepo/front-core-lib/fl-dialog';
import { FlInputFileModule } from '@monorepo/front-core-lib/fl-input-file';
import { FlLoaderModule } from '@monorepo/front-core-lib/fl-loader';
import { TranslatePipe } from '@ngx-translate/core';
import { Observable } from 'rxjs';

import { HaDocumentation } from '../../../ha-core/ha-model/ha-entities/ha-documentation.class';
import { HaFolder } from '../../../ha-core/ha-model/ha-entities/ha-folder.class';
import { HaNodeDTO, HaNodeType } from '../../../ha-core/ha-model/ha-entities/ha-node.class';
import { HaDocumentationService } from '../../../ha-core/ha-service/ha-documentation.service';
import { HaFolderService } from '../../../ha-core/ha-service/ha-folder.service';

@Component({
  selector: 'ha-brick-sidenav-create-form-dialog',
  templateUrl: './ha-brick-sidenav-create-form-dialog.component.html',
  styleUrls: ['./ha-brick-sidenav-create-form-dialog.component.scss'],
  imports: [
    FlDialogModule,
    MatDialogContent,
    ReactiveFormsModule,
    MatRadioGroup,
    MatRadioButton,
    MatFormField,
    MatLabel,
    MatInput,
    FlCoreDirectiveModule,
    MatError,
    FlInputFileModule,
    FlLoaderModule,
    MatDialogActions,
    MatButton,
    FlCorePipeModule,
    TranslatePipe,
  ],
})
export class HaBrickSidenavCreateFormDialogComponent
  extends FlFormDialogAbstractDirective<Partial<HaNodeDTO>>
  implements OnInit
{
  private folderService = inject(HaFolderService);
  private documentationService = inject(HaDocumentationService);

  isLoadingImport: boolean = false;
  isUpdate: boolean = false;
  type: string;
  errorFile: boolean;
  errorFileText: string;

  static isValidTechDocFile(file: any): boolean {
    return file.brick_name != null && file.brick_version != null && file.json_version != null;
  }

  constructor() {
    super();
  }

  ngOnInit(): void {
    this.isUpdate = this.dialogInput.mode == 'update';
    this.init();
    this.formGp.value.folderId = this.dialogInput.object.folderId;
  }

  buildForm(): UntypedFormGroup {
    return new FormBuilder().group({
      id: [null],
      title: [null, Validators.required],
      isFolder: [false],
      type: [HaNodeType.DOC],
    });
  }

  create(formValue: HaNodeDTO): Observable<HaFolder | HaDocumentation> {
    formValue.folderId = this.dialogInput.object.folderId;

    this.formGp.value.isFolder = this.formGp.value.type == HaNodeType.FOL;

    if (this.formGp.value.isFolder) {
      return this.folderService.create(formValue);
    }
    return this.folderService.createDocumentation(formValue);
  }

  onFileSelected($event: File): void {
    this.isLoading = true;

    if ($event == null) {
      return;
    }

    this.errorFile = false;
    if (!$event.name.endsWith('.json')) {
      this.errorFile = true;
      this.errorFileText = 'file_wrong_type';
    }

    if (typeof FileReader !== 'undefined' && !this.errorFile) {
      const reader = new FileReader();

      reader.onload = (e: any) => {
        const srcResult = JSON.parse(e.target.result);
        if (HaBrickSidenavCreateFormDialogComponent.isValidTechDocFile(srcResult)) {
          this.dialogRef.close([srcResult, HaNodeType.TEC]);
          this.isLoading = false;
        } else {
          this.errorFile = true;
          this.errorFileText = 'file_wrong_type';
        }
        this.isLoading = false;
      };

      reader.readAsText($event);
    }
  }

  update(formValue: HaNodeDTO): Observable<HaFolder | HaDocumentation> {
    return this.formGp.value.isFolder
      ? this.folderService.update(formValue)
      : this.documentationService.update(formValue);
  }

  getCreateSuccessMessage(): string {
    return this.formGp.value.isFolder ? 'folder_created' : 'documentation_created';
  }

  getUpdateSuccessMessage(): string {
    return this.formGp.value.isFolder ? 'folder_updated' : 'documentation_updated';
  }
}
