import { Directive, Input } from '@angular/core';
import { FlDatasource, FlViewContext } from '@monorepo/front-core-lib/fl-core';

/**
 * Use to make typing work in the HTML
 */
export interface FlInputSearchOptionContext<T> extends FlViewContext<T> {
  flInputSearchOption: T;
}

/**
 * Directive to define the template for the options of the input search
 */
@Directive({
  selector: '[flInputSearchOption]',
  standalone: false,
})
export class FlInputSearchOptionDirective<T> {
  /**
   *  | string is for empty *flInputSearchOption
   */
  @Input() flInputSearchOption!: FlDatasource<T> | '';

  /**
   * Use to make typing work in the HTML
   */
  static ngTemplateContextGuard<TContext>(
    _: FlInputSearchOptionDirective<TContext>,
    ctx: unknown
  ): ctx is FlInputSearchOptionContext<TContext> {
    return true;
  }
}
