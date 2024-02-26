import {Component, Inject, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {TeVariableFormInfo, TeVariableFormType} from '../../model/te-variable.class';

@Component({
  selector: 'te-variable-form',
  templateUrl: './te-variable-form.component.html',
  styleUrl: './te-variable-form.component.scss',
})
export class TeVariableFormComponent implements OnInit {

  @Input() formGroup: FormGroup = new FormBuilder().group({
    name: '',
    description: '',
    type: 'string' as TeVariableFormType,
    value: null as string
  });

  constructor(@Inject(MAT_DIALOG_DATA) private input: TeVariableFormInfo,
              private dialogRef: MatDialogRef<TeVariableFormComponent>) {
  }

  ngOnInit(): void {
    this.formGroup.patchValue(this.input);
  }


  save(): void {
    if (this.formGroup.valid) {
      this.dialogRef.close(this.formGroup.value);
    }
  }

}
