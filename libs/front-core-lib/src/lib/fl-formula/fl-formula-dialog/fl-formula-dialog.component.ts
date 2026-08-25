import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FlFormDialogInput } from '@monorepo/front-core-lib/fl-core';
import { FlTranslatableText } from '@monorepo/front-core-lib/fl-translate';
import { debounceTime, Observable, startWith } from 'rxjs';

export interface FlFormulaDialogInput extends FlFormDialogInput<string> {
  helpText?: FlTranslatableText;
}

@Component({
  selector: 'fl-formula-dialog',
  templateUrl: './fl-formula-dialog.component.html',
  styleUrls: ['./fl-formula-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class FlFormulaDialogComponent implements OnInit {
  private dialogRef = inject<MatDialogRef<FlFormulaDialogComponent>>(MatDialogRef);

  @ViewChild('viewContainer', { static: true, read: ViewContainerRef }) viewContainer: ViewContainerRef;

  formulaControl: FormControl<string | null | undefined>;

  formula$: Observable<string | null | undefined>;
  input: FlFormulaDialogInput = inject(MAT_DIALOG_DATA);

  async ngOnInit(): Promise<void> {
    this.formulaControl = new FormControl(this.input.object, [Validators.required]);

    this.formula$ = this.formulaControl.valueChanges.pipe(
      startWith(this.formulaControl.value),
      debounceTime(300)
    );
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
