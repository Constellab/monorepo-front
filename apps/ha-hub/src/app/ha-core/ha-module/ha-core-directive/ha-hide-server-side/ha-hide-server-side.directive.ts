import {
  Directive,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
  TemplateRef,
  ViewContainerRef,
  inject,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { FlAbstractIfDirective } from '@monorepo/front-core-lib';
import { Observable } from 'rxjs';

@Directive({
  selector: '[haHideServerSide]',
  standalone: false,
})
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
