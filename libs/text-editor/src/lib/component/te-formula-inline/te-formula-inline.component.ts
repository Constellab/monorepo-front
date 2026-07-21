import { ChangeDetectionStrategy,Component, HostBinding, HostListener, inject, OnInit } from '@angular/core';
import { FlDialogService } from '@monorepo/front-core-lib/fl-dialog';
import { FlFormulaDialogComponent, FlFormulaDialogInput } from '@monorepo/front-core-lib/fl-formula';

import { TeElementInlineDirective } from '../../model/te-element.directive';

export interface TeFormulaInlineToolData {
  formula: string;
}

@Component({
  selector: 'te-formula-inline',
  templateUrl: './te-formula-inline.component.html',
  styleUrl: './te-formula-inline.component.scss',
  changeDetection: ChangeDetectionStrategy.Eager,
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
    const input: FlFormulaDialogInput = {
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
