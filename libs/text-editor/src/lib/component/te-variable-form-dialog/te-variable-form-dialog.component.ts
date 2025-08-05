import { Component, inject,Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { TeVariableFormInfo, TeVariableFormType } from '../../model/te-variable.class';

@Component({
  selector: 'te-variable-form-dialog',
  templateUrl: './te-variable-form-dialog.component.html',
  styleUrl: './te-variable-form-dialog.component.scss',
  standalone: false,
})
export class TeVariableFormDialogComponent implements OnInit {
  private input = inject<TeVariableFormInfo>(MAT_DIALOG_DATA);
  private dialogRef = inject<MatDialogRef<TeVariableFormDialogComponent>>(MatDialogRef);

  @Input() formGroup: FormGroup = new FormBuilder().group({
    name: '',
    description: '',
    type: 'string' as TeVariableFormType,
    value: null as string,
  });

  ngOnInit(): void {
    this.formGroup.patchValue(this.input);
  }

  save(): void {
    if (this.formGroup.valid) {
      const value = this.formGroup.value;
      value.name = value.name.trim();
      this.dialogRef.close(value);
    }
  }
}
