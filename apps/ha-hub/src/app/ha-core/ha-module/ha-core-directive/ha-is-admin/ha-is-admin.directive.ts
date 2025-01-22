import { Directive, OnDestroy, OnInit, TemplateRef, ViewContainerRef, inject } from '@angular/core';
import { FlAbstractIfDirective } from '@monorepo/front-core-lib';
import { HaAuthenticatedUserService } from '../../../ha-service/ha-authenticated-user.service';
import { Observable } from 'rxjs';

@Directive({
  selector: '[haIsAdmin]',
  standalone: false,
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
