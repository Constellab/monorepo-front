import { ChangeDetectionStrategy,Component } from '@angular/core';

import { TD_EXPRESSION_FUNCTIONS } from '../td-expression-input/td-expression-input.model';

@Component({
  selector: 'td-expression-help',
  templateUrl: './td-expression-help.component.html',
  styleUrl: './td-expression-help.component.scss',
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class TdExpressionHelpComponent {
  readonly functions = TD_EXPRESSION_FUNCTIONS;
}
