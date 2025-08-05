import { Component, inject,OnInit } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  ReactiveFormsModule,
  UntypedFormArray,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatOption } from '@angular/material/core';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogContent, MatDialogRef } from '@angular/material/dialog';
import { MatDivider } from '@angular/material/divider';
import { MatError, MatFormField, MatLabel } from '@angular/material/form-field';
import { MatRadioButton, MatRadioGroup } from '@angular/material/radio';
import { MatSelect } from '@angular/material/select';
import { ClCachedObservable } from '@monorepo/core-lib';
import { FlCorePipeModule } from '@monorepo/front-core-lib/fl-core-pipe';
import { FlDialogModule } from '@monorepo/front-core-lib/fl-dialog';
import { FlSectionModule } from '@monorepo/front-core-lib/fl-section';
import { FlFileHelper } from '@monorepo/front-core-lib/fl-translate';
import { LiFileResourceService, LiFileTypeAdditionalInfo, LiTypeEntity } from '@monorepo/lab-lib/li-core';
import { TdTypingName } from '@monorepo/technical-doc';
import { TranslatePipe } from '@ngx-translate/core';
import { Observable } from 'rxjs';

export type LiFsNodeTypesSelectionDialogMode = 'files' | 'folder' | 'filesOrFolder';

export interface LiFsNodeTypesSelectionDialogInput {
  dialogMode: LiFsNodeTypesSelectionDialogMode;
  filenames: string[];
  helpText?: string;
}

// object used in the form
interface LabForm {
  nodeMode: 'files' | 'folder';
  files: LabFsNodeWithType[];
}

interface LabFsNodeWithType {
  filename: string;
  typingName: string;
}

// object used in the form
export type LiFsNodeTypesSelectionDialogResult = LiFsNodeTypesFileDialogResult | UploadFsNodeTypeFolderResult;

export interface LiFsNodeTypesFileDialogResult {
  uploadMode: 'files';
  fileTypingNames: string[];
}

export interface UploadFsNodeTypeFolderResult {
  uploadMode: 'folder';
  folderTypingName: string;
}

/**
 * Dialog used to select type of multiple files or folder
 * If files --> it allows to select the file type for each uploaded file
 * If folder --> one mode like the one before and one mode to directly upload the folder
 */
@Component({
  selector: 'li-fs-node-types-selection-dialog',
  templateUrl: './li-fs-node-types-selection-dialog.component.html',
  styleUrls: ['./li-fs-node-types-selection-dialog.component.scss'],
  imports: [
    FlDialogModule,
    MatDialogContent,
    ReactiveFormsModule,
    MatRadioGroup,
    MatRadioButton,
    FlSectionModule,
    MatFormField,
    MatLabel,
    MatSelect,
    MatOption,
    MatError,
    MatDivider,
    MatDialogActions,
    MatButton,
    FlCorePipeModule,
    TranslatePipe,
  ],
})
export class LiFsNodeTypesSelectionDialogComponent implements OnInit {
  private input = inject<LiFsNodeTypesSelectionDialogInput>(MAT_DIALOG_DATA);
  private fileResourceService = inject(LiFileResourceService);
  private dialogRef = inject<MatDialogRef<LiFsNodeTypesSelectionDialogComponent>>(MatDialogRef);

  selectedNodes: LiFsNodeTypesSelectionDialogMode;

  formArray: UntypedFormArray;
  formGp: UntypedFormGroup;

  resourceTypes$: Observable<LiTypeEntity[]>;

  helpText: string;

  private fileTypes$: ClCachedObservable<LiTypeEntity[]>;
  private folderTypes$: ClCachedObservable<LiTypeEntity[]>;

  constructor() {
    const input = this.input;

    this.selectedNodes = input.dialogMode;
  }

  ngOnInit(): void {
    this.fileTypes$ = new ClCachedObservable(this.fileResourceService.getFileTypes());
    this.folderTypes$ = new ClCachedObservable(this.fileResourceService.getFolderTypes());
    this.buildForm();
    this.onNodeModeChange(this.formGp.value.nodeMode);
    this.helpText = this.input.helpText;
  }

  private buildForm(): void {
    this.formArray = new FormArray([]);
    this.formGp = new FormBuilder().group({
      nodeMode: this.selectedNodes === 'files' ? 'files' : 'folder',
      files: this.formArray,
    });
  }

  onNodeModeChange(mode: 'files' | 'folder'): void {
    this.formArray.clear();
    if (mode === 'files') {
      this.initFormFiles();
    } else {
      this.initFormFolder();
    }
  }

  private async initFormFiles(): Promise<void> {
    this.resourceTypes$ = this.fileTypes$.getObs();

    this.resourceTypes$.subscribe((typeEntities) => {
      const filesWithType: LabFsNodeWithType[] = [];
      // detect the typing name automatically
      for (const filename of this.input.filenames) {
        // set the file as default typing name
        filesWithType.push({
          filename: filename,
          typingName: this.getFileDefaultTyping(filename, typeEntities),
        });
      }

      for (const file of filesWithType) {
        this.addItemToFormArray(file);
      }
    });
  }

  private initFormFolder(): void {
    this.resourceTypes$ = this.folderTypes$.getObs();

    this.addItemToFormArray({ filename: null, typingName: TdTypingName.resource.folder });
  }

  private addItemToFormArray(fileWithType: LabFsNodeWithType): void {
    this.formArray.push(
      new FormBuilder().group({
        filename: [fileWithType.filename],
        typingName: [fileWithType.typingName, Validators.required],
      })
    );
  }

  submit(): void {
    if (this.formGp.valid) {
      const formValue: LabForm = this.formGp.getRawValue();

      const typingNames: string[] = formValue.files.map((file) => file.typingName);

      if (formValue.nodeMode === 'files') {
        this.closeDialog({
          uploadMode: 'files',
          fileTypingNames: typingNames,
        });
      } else {
        this.closeDialog({
          uploadMode: 'folder',
          folderTypingName: typingNames[0], // in folder mode there is only on typing name
        });
      }
    }
  }

  private closeDialog(result: LiFsNodeTypesSelectionDialogResult): void {
    this.dialogRef.close(result);
  }

  get title(): string {
    return this.selectedNodes === 'files' ? 'li.select_file_types' : 'li.upload_folder';
  }

  get typePlaceholder(): string {
    return this.formGp.value.nodeMode === 'files' ? 'li.select_file_type' : 'li.select_folder_type';
  }

  private getFileDefaultTyping(filename: string, typeEntities: LiTypeEntity[]): string {
    const extension = FlFileHelper.getFileExtension(filename);

    for (const type of typeEntities) {
      const additionalInfo: LiFileTypeAdditionalInfo = type.additionalInfo;
      if (additionalInfo && additionalInfo.default_extensions.includes(extension)) {
        return type.typingName;
      }
    }
    // set the file as default typing name
    return TdTypingName.resource.file;
  }
}
