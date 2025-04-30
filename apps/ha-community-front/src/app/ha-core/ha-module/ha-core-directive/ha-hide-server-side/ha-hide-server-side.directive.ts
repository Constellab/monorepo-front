import {
  Directive,
  inject,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
  TemplateRef,
  ViewContainerRef,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { FlAbstractIfDirective } from '@monorepo/front-core-lib/fl-core';
import { Observable } from 'rxjs';

@Directive({ selector: '[haHideServerSide]' })
export class HaHideServerSideDirective extends FlAbstractIfDirective implements OnInit, OnDestroy {
  private platformId = inject(PLATFORM_ID);

  constructor() {
    const templateRef = inject<TemplateRef<any>>(TemplateRef);
    const viewContainer = inject(ViewContainerRef);

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
