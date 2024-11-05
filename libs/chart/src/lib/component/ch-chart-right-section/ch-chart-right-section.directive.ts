import { Directive, Input } from '@angular/core';

/**
 * Parent class for component that represent the right section of the chart (usually the legend).
 */
@Directive()
export class ChChartRightSectionDirective<T = any> {
  @Input() data: T;
}
