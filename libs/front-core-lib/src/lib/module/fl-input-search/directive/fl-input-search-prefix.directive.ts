import { Directive, Input } from '@angular/core';
import { FlViewContext } from '../../../model/fl-view-context.class';
import { FlDatasource } from '../../../model/datasource/fl-datasource.class';

/**
 * Use to make typing work in the HTML
 */
export interface FlInputSearchPrefixContext<T> extends FlViewContext<T> {
  flInputSearchPrefix: T;
}

/**
 * Directive to define the template for the prefix of the input search
 */
@Directive({
  selector: '[flInputSearchPrefix]',
})
export class FlInputSearchPrefixDirective<T> {
  /**
   *  | string is for empty *flInputSearchPrefix
   */
  @Input() flInputSearchPrefix!: FlDatasource<T> | '';

  /**
   * Use to make typing work in the HTML
   */
  static ngTemplateContextGuard<TContext>(
    _: FlInputSearchPrefixDirective<TContext>,
    ctx: unknown
  ): ctx is FlInputSearchPrefixContext<TContext> {
    return true;
  }
}
