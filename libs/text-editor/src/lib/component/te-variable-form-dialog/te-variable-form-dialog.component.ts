import {Component, Inject, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {TeVariableFormInfo, TeVariableFormType} from '../../model/te-variable.class';

export interface TeVariableFormDialogInput {
  data: TeVariableFormInfo;
  isEditable: boolean;
}

@Component({
  selector: 'te-variable-form-dialog',
  templateUrl: './te-variable-form-dialog.component.html',
  styleUrl: './te-variable-form-dialog.component.scss',
})
export class TeVariableFormDialogComponent implements OnInit {

  @Input() formGroup: FormGroup = new FormBuilder().group({
    name: '',
    description: '',
    type: 'string' as TeVariableFormType,
    value: null as string
  });

  constructor(@Inject(MAT_DIALOG_DATA) private input: TeVariableFormDialogInput,
              private dialogRef: MatDialogRef<TeVariableFormDialogComponent>) {
  }

  ngOnInit(): void {
    this.formGroup.patchValue(this.input.data);
    if (!this.input.isEditable) {
      this.formGroup.disable();
    }
  }


  save(): void {
    if (!this.isEditable) this.dialogRef.close();
    if (this.formGroup.valid) {
      this.dialogRef.close(this.formGroup.value);
    }
  }

  get isEditable(): boolean {
    return this.input.isEditable;
  }

}
