import { Directive, inject, OnDestroy, OnInit, TemplateRef, ViewContainerRef } from '@angular/core';
import { CaCurrentSpaceService } from '../../../service-api/ca-current-space.service';
import { CaAuthenticatedUserService } from '../../../service-api/ca-authenticated-user.service';
import { FlAbstractIfDirective } from '@monorepo/front-core-lib/fl-core';

/**
 * Structural directive that work like ngIf, and show element only is user is admin of the current space (or g admin)
 */
@Directive({ selector: '[caIsSpaceAdmin]' })
export class CaIsSpaceAdminDirective extends FlAbstractIfDirective implements OnInit, OnDestroy {
  private currentSpaceService = inject(CaCurrentSpaceService);
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
    return this.authenticatedUserService.isAdmin() || this.currentSpaceService.isSpaceAdmin();
  }

  ngOnDestroy(): void {
    super.ngOnDestroy();
  }
}
