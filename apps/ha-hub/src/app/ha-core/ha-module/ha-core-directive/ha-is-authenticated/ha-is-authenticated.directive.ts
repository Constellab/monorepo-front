import { Directive, OnDestroy, OnInit, TemplateRef, ViewContainerRef, inject } from '@angular/core';
import { FlAbstractIfDirective } from '@monorepo/front-core-lib';
import { Observable } from 'rxjs';
import { HaAuthService } from '../../../ha-service/ha-auth.service';

@Directive({
  selector: '[haIsAuthenticated]',
  standalone: false,
})
export class HaIsAuthenticatedDirective extends FlAbstractIfDirective implements OnInit, OnDestroy {
  private loginService = inject(HaAuthService);

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
    return this.loginService.hasAuthorizationCookie();
  }
}
