import { ChangeDetectionStrategy,Component, inject, Input } from '@angular/core';
import { FlDialogService } from '@monorepo/front-core-lib/fl-dialog';
import { FlFormulaDialogComponent, FlFormulaDialogInput } from '@monorepo/front-core-lib/fl-formula';
import { FlTranslatableText } from '@monorepo/front-core-lib/fl-translate';

import { TeElementBlockDirective } from '../../model/te-element.directive';

@Component({
  selector: 'te-formula',
  templateUrl: './te-formula.component.html',
  styleUrl: './te-formula.component.scss',
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class TeFormulaComponent extends TeElementBlockDirective {
  private dialogService = inject(FlDialogService);

  @Input() formulaTitle: string;

  @Input() caption: string;

  @Input() helpText: FlTranslatableText;

  @Input() formula: string;

  public openInitFormulaDialog(): void {
    // on init, we check if we need to show formula dialog
    if (!this.disabled) {
      const input: FlFormulaDialogInput = {
        mode: 'create',
        helpText: this.helpText,
      };
      this.dialogService
        .openSmallDialog(FlFormulaDialogComponent, { data: input })
        .afterClosed()
        .subscribe((formula: string) => this.setFormula(formula));
    }
  }

  public updateFormula(): void {
    const input: FlFormulaDialogInput = {
      mode: 'update',
      object: this.formula,
      helpText: this.helpText,
    };
    this.dialogService
      .openSmallDialog(FlFormulaDialogComponent, { data: input })
      .afterClosed()
      .subscribe((formula: string) => this.setFormula(formula));
  }

  public setFormula(formula?: string): void {
    if (formula) {
      this.formula = formula;
    }
  }
}
