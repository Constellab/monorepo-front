import { Component, HostBinding, HostListener, inject, OnInit } from '@angular/core';
import { TeElementInlineDirective } from '../../model/te-element.directive';
import { FlFormulaDialogComponent, TeFormulaDialogInput } from '@monorepo/front-core-lib/fl-formula';
import { FlDialogService } from '@monorepo/front-core-lib/fl-dialog';

export interface TeFormulaInlineToolData {
  formula: string;
}

@Component({
  selector: 'te-formula-inline',
  templateUrl: './te-formula-inline.component.html',
  styleUrl: './te-formula-inline.component.scss',
  standalone: false,
})
export class TeFormulaInlineComponent
  extends TeElementInlineDirective<TeFormulaInlineToolData>
  implements OnInit
{
  private dialogService = inject(FlDialogService);

  @HostBinding('attr.contenteditable') contenteditable = 'false';

  @HostListener('click') onClick(): void {
    this.openFormDialog();
  }

  ngOnInit(): void {
    if (!this.disabled && this.newElement) {
      this.openFormDialog();
    }
  }

  public openFormDialog(): void {
    const input: TeFormulaDialogInput = {
      mode: 'update',
      object: this.data.formula,
      helpText: 'teTextEditor.formula_help',
    };
    this.dialogService
      .openSmallDialog(FlFormulaDialogComponent, { data: input })
      .afterClosed()
      .subscribe((formula: string) => this.setFormula(formula));
  }

  public setFormula(formula?: string): void {
    if (formula) {
      this.setData({ formula: formula });
    }
  }
}
