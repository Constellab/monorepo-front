import { Directive, inject, OnDestroy, OnInit, TemplateRef, ViewContainerRef } from '@angular/core';
import { FlAbstractIfDirective } from '@monorepo/front-core-lib/fl-core';

import { CaAuthenticatedUserService } from '../../../service-api/ca-authenticated-user.service';

/**
 * Structurale directive that work like ngIf, and show element only is user is admin
 */
@Directive({ selector: '[caIsAdmin]' })
export class CaIsAdminDirective extends FlAbstractIfDirective implements OnInit, OnDestroy {
  private authenticatedUserService = inject(CaAuthenticatedUserService);

  constructor() {
    const templateRef = inject<TemplateRef<any>>(TemplateRef);
    const viewContainer = inject(ViewContainerRef);

    super(templateRef, viewContainer);
  }

  ngOnInit(): void {
    super.ngOnInit();
  }

  protected showView(): boolean {
    return this.authenticatedUserService.isAdmin();
  }

  ngOnDestroy(): void {
    super.ngOnDestroy();
  }
}
