import { Directive, inject, OnDestroy, OnInit, TemplateRef, ViewContainerRef } from '@angular/core';
import { FlAbstractIfDirective } from '@monorepo/front-core-lib/fl-core';

import { CaAuthenticatedUserService } from '../../../service-api/ca-authenticated-user.service';

/**
 * Structural directive that work like ngIf, and show element
 * only if user is at least a user of the current space (not a viewer) or a g admin
 */
@Directive({ selector: '[caIsSpaceUser]' })
export class CaIsSpaceUserDirective extends FlAbstractIfDirective implements OnInit, OnDestroy {
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
    return this.authenticatedUserService.isCurrentSpaceUser();
  }

  ngOnDestroy(): void {
    super.ngOnDestroy();
  }
}
