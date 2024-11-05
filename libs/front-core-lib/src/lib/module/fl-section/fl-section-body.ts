import { Directive, Input, TemplateRef } from '@angular/core';
import { Observable } from 'rxjs';
import { FlDatasource } from '../../model/datasource/fl-datasource.class';
import { FlStatusEvent } from '../../model/fl-status-event.class';
import { FlViewContext } from '../../model/fl-view-context.class';

/**
 * Use to make typing work in the HTML
 */
export interface FlAsyncSectionBodyContext<T> extends FlViewContext<T> {
  // use to type the *flSectionBody directive
  flSectionBody: T;

  // use to type the *flSectionBodyArray directive
  flSectionBodyDatasource: T[];

  // use to type the *flSectionBodyStatusEvent directive
  flSectionBodyStatusEvent: T;
}

@Directive({
  selector: '[flSectionBody], [flSectionBodyDatasource], [flSectionBodyStatusEvent]',
})
export class FlSectionBodyDirective<T> {
  /**
   * Use this when you want to provide a simple observable object
   *  | string is for empty *flSectionBody
   */
  @Input() flSectionBody!: Observable<T> | '';

  /**
   * Use this when you want to provide an array observable object
   */
  @Input() flSectionBodyDatasource!: FlDatasource<T> | '';

  /**
   * Use this when you want to provide an FlStatusEvent object
   */
  @Input() flSectionBodyStatusEvent!: FlStatusEvent<T> | '';

  /**
   * Use to make typing work in the HTML
   */
  static ngTemplateContextGuard<TContext>(
    _: FlSectionBodyDirective<TContext>,
    ctx: unknown
  ): ctx is FlAsyncSectionBodyContext<TContext> {
    return true;
  }

  constructor(public _template: TemplateRef<any>) {}
}
