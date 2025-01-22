import { Directive, Input, TemplateRef, inject } from '@angular/core';
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

  // use to type the *flSectionBodyStatusObsEvent directive
  flSectionBodyStatusObsEvent: T;
}

@Directive({
  selector:
    '[flSectionBody], [flSectionBodyDatasource], [flSectionBodyStatusEvent], [flSectionBodyStatusObsEvent]',
  standalone: false,
})
export class FlSectionBodyDirective<T> {
  _template = inject<TemplateRef<any>>(TemplateRef);

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
   * Use this when you want to provide an Observable of FlStatusEvent object
   */
  @Input() flSectionBodyStatusObsEvent!: Observable<FlStatusEvent<T>> | '';

  /**
   * Use to make typing work in the HTML
   */
  static ngTemplateContextGuard<TContext>(
    _: FlSectionBodyDirective<TContext>,
    ctx: unknown
  ): ctx is FlAsyncSectionBodyContext<TContext> {
    return true;
  }
}
