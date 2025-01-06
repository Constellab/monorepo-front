import {
  Directive,
  Inject,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
  TemplateRef,
  ViewContainerRef,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { FlAbstractIfDirective } from '@monorepo/front-core-lib';
import { Observable } from 'rxjs';

@Directive({
  selector: '[haHideServerSide]',
})
export class HaHideServerSideDirective extends FlAbstractIfDirective implements OnInit, OnDestroy {
  constructor(
    templateRef: TemplateRef<any>,
    viewContainer: ViewContainerRef,
    @Inject(PLATFORM_ID) private platformId: object
  ) {
    super(templateRef, viewContainer);
  }

  ngOnInit(): void {
    super.ngOnInit();
  }

  ngOnDestroy(): void {
    super.ngOnDestroy();
  }

  protected showView(): boolean | Observable<boolean> {
    return isPlatformBrowser(this.platformId);
  }
}
