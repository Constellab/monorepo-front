import {Component, ComponentRef, Inject, OnDestroy, OnInit, ViewChild, ViewContainerRef} from '@angular/core';
import {FormControl} from '@ngneat/reactive-forms';
import {Validators} from '@angular/forms';
import {debounceTime} from 'rxjs/operators';
import {startWith} from 'rxjs';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {FlFormDialogInput} from '@monorepo/front-core-lib';

export type CaTextEditorFormulaDialogInput = FlFormDialogInput<string>;

@Component({
  selector: 'ca-text-editor-formula-dialog',
  templateUrl: './ca-text-editor-formula-dialog.component.html',
  styleUrls: ['./ca-text-editor-formula-dialog.component.scss']
})
export class CaTextEditorFormulaDialogComponent implements OnInit, OnDestroy {

  @ViewChild('viewContainer', {static: true, read: ViewContainerRef}) viewContainer: ViewContainerRef;

  formulaControl: FormControl<string>;

  private componentRef: ComponentRef<any>;


  constructor(@Inject(MAT_DIALOG_DATA) private input: CaTextEditorFormulaDialogInput,
              private dialogRef: MatDialogRef<CaTextEditorFormulaDialogComponent>) {
  }

  async ngOnInit(): Promise<void> {
    this.formulaControl = new FormControl(this.input.object, [Validators.required]);

    const {FlFormulaStandaloneComponent} = await import('@monorepo/front-core-lib');
    this.componentRef = this.viewContainer.createComponent(FlFormulaStandaloneComponent);
    this.componentRef.instance.formula = this.formulaControl.valueChanges.pipe(
      startWith(this.formulaControl.value),
      debounceTime(300));
  }

  get title(): string {
    return this.input.mode === 'create' ? 'caTextEditor.add_formula' : 'caTextEditor.edit_formula';
  }

  submit(): void {
    if (this.formulaControl.valid) {
      this.dialogRef.close(this.formulaControl.value);
    }
  }

  ngOnDestroy(): void {
    this.componentRef.destroy();
  }

}
