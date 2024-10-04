import { Component, Input } from '@angular/core';
import {
  FlDialogService,
  FlFormulaDialogComponent,
  FlTranslatableText,
  TeFormulaDialogInput
} from '@monorepo/front-core-lib';
import { TeElementBlockDirective } from '../../model/te-element.directive';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'te-formula',
  templateUrl: './te-formula.component.html',
  styleUrl: './te-formula.component.scss',
})
export class TeFormulaComponent extends TeElementBlockDirective {

  @Input() formulaTitle: string;

  @Input() caption: string;

  @Input() helpText: FlTranslatableText;

  public formula$: BehaviorSubject<string> = new BehaviorSubject<string>(null);

  constructor(private dialogService: FlDialogService) {
    super();
  }

  public openInitFormulaDialog(): void {
    // on init, we check if we need to show formula dialog
    if (!this.disabled) {
      const input: TeFormulaDialogInput = {
        mode: 'create',
        helpText: this.helpText,
      };
      this.dialogService.openSmallDialog(FlFormulaDialogComponent, {data: input}).afterClosed().subscribe(
        (formula: string) => this.setFormula(formula)
      );
    }
  }

  public updateFormula(): void {
    const input: TeFormulaDialogInput = {
      mode: 'update',
      object: this.formula$.value,
      helpText: this.helpText,
    };
    this.dialogService.openSmallDialog(FlFormulaDialogComponent, {data: input})
      .afterClosed().subscribe((formula: string) => this.setFormula(formula));
  }

  public setFormula(formula?: string): void {
    if (formula) {
      this.formula$.next(formula);
    }
  }

}
