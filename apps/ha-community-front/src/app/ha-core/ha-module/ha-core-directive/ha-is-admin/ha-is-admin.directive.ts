import { Directive, inject, OnDestroy, OnInit, TemplateRef, ViewContainerRef } from '@angular/core';
import { FlAbstractIfDirective } from '@monorepo/front-core-lib/fl-core';
import { Observable } from 'rxjs';

import { HaAuthenticatedUserService } from '../../../ha-service/ha-authenticated-user.service';

@Directive({
  selector: '[haIsAdmin]',
  host: { ngSkipHydration: 'true' },
})
export class HaIsAdminDirective extends FlAbstractIfDirective implements OnInit, OnDestroy {
  private authenticatedUserService = inject(HaAuthenticatedUserService);

  constructor() {
    const templateRef = inject<TemplateRef<any>>(TemplateRef);
    const viewContainer = inject(ViewContainerRef);

    super(templateRef, viewContainer);
  }

  ngOnInit(): void {
    super.ngOnInit();
  }

  protected showView(): Observable<boolean> {
    return this.authenticatedUserService.isAdmin();
  }

  ngOnDestroy(): void {
    super.ngOnDestroy();
  }
}
