import { Directive, inject, OnDestroy, OnInit, TemplateRef, ViewContainerRef } from '@angular/core';
import { FlAbstractIfDirective } from '@monorepo/front-core-lib/fl-core';
import { Observable } from 'rxjs';

import { HaAuthenticatedUserService } from '../../../ha-service/ha-authenticated-user.service';

@Directive({ selector: '[haIsAuthenticated]' })
export class HaIsAuthenticatedDirective extends FlAbstractIfDirective implements OnInit, OnDestroy {
  private authenticatedUserService = inject(HaAuthenticatedUserService);

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

  /**
   * Follows the authoritative state rather than a cookie, so the view also reacts to a login or a
   * logout happening while it is displayed.
   */
  protected showView(): boolean | Observable<boolean> {
    return this.authenticatedUserService.isAuthenticated();
  }
}
