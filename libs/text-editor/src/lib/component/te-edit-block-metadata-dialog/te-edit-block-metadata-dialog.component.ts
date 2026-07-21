import { ChangeDetectionStrategy,Component, inject, OnInit } from '@angular/core';
import { FormBuilder, UntypedFormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { TeMetadataBlockConfig, TeMetadataPermission } from '../../model/te-metadata-block-config.class';

@Component({
  selector: 'te-edit-block-metadata-dialog',
  standalone: false,

  templateUrl: './te-edit-block-metadata-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './te-edit-block-metadata-dialog.component.scss',
})
export class TeEditBlockMetadataDialogComponent implements OnInit {
  private dialogRef = inject<MatDialogRef<TeEditBlockMetadataDialogComponent>>(MatDialogRef);

  dialogInput: TeMetadataBlockConfig;
  formGp: UntypedFormGroup;

  permissions: string[] = Object.values(TeMetadataPermission);

  constructor() {
    this.dialogInput = inject<TeMetadataBlockConfig>(MAT_DIALOG_DATA);
  }

  ngOnInit(): void {
    this.formGp = this.buildForm();
  }

  buildForm(): UntypedFormGroup {
    return new FormBuilder().group({
      appRoute: [this.dialogInput?.appRoute ?? null],
      permission: [this.dialogInput?.permission ?? null],
    });
  }

  submit(): void {
    this.dialogRef.close(this.formGp.value);
  }
}
