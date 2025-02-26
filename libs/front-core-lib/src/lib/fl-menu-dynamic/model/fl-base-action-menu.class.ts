import { mergeMap, Observable, Subject } from 'rxjs';
import { FlMenuDynamicService } from '../fl-menu-dynamic.service';
import { FlMenuDynamic } from './fl-menu-dynamic.class';
import { Injector } from '@angular/core';

/**
 * Base class to manage the action menu for an object
 */
export class FlBaseActionMenu<T> {
  protected subject: Subject<T> = new Subject();

  constructor(protected injector: Injector) {}

  protected generateMenu(menu: FlMenuDynamic[], event: MouseEvent): Observable<T> {
    const overlayRef = this.injector.get(FlMenuDynamicService).openDynamicMenuFromMouseEvent(menu, event);

    return overlayRef.detachments().pipe(
      mergeMap((menu: FlMenuDynamic) => {
        // when the menu was closed without clicking a button
        // we have to complete the subject
        // if the menu was a button, the subject will be completed in the button action
        if (!menu || menu.type !== 'button') {
          this.subject.complete();
        }
        return this.subject.asObservable();
      })
    );
  }
}
