import { Directive, OnDestroy, OnInit, TemplateRef, ViewContainerRef, inject } from '@angular/core';
import { FlAbstractIfDirective } from '@monorepo/front-core-lib';
import { CaAuthenticatedUserService } from '../../../service-api/ca-authenticated-user.service';

/**
 * Structurale directive that work like ngIf, and show element only is user is admin
 */
@Directive({
  selector: '[caIsAdmin]',
  standalone: false,
})
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
