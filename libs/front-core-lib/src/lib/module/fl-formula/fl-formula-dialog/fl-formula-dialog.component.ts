import { Component, inject, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormControl, Validators } from '@angular/forms';
import { debounceTime, Observable, startWith } from 'rxjs';
import { FlTranslatableText } from '../../fl-translate/model/fl-translate-param';
import { FlFormDialogInput } from '../../../model/fl-form.class';

export interface TeFormulaDialogInput extends FlFormDialogInput<string> {
  helpText?: FlTranslatableText;
}

@Component({
  selector: 'fl-formula-dialog',
  templateUrl: './fl-formula-dialog.component.html',
  styleUrls: ['./fl-formula-dialog.component.scss']
})
export class FlFormulaDialogComponent implements OnInit {

  @ViewChild('viewContainer', { static: true, read: ViewContainerRef }) viewContainer: ViewContainerRef;

  formulaControl: FormControl<string>;

  formula$: Observable<string>;
  input: TeFormulaDialogInput = inject(MAT_DIALOG_DATA);

  constructor(private dialogRef: MatDialogRef<FlFormulaDialogComponent>) {
  }

  async ngOnInit(): Promise<void> {
    this.formulaControl = new FormControl(this.input.object, [Validators.required]);

    this.formula$ = this.formulaControl.valueChanges.pipe(
      startWith(this.formulaControl.value),
      debounceTime(300));
  }

  get title(): string {
    return this.input.mode === 'create' ? 'flFormula.add_formula' : 'flFormula.edit_formula';
  }

  submit(): void {
    if (this.formulaControl.valid) {
      this.dialogRef.close(this.formulaControl.value);
    }
  }
}
