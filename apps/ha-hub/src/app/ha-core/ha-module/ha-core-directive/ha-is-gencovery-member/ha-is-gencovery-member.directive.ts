import { Directive, OnDestroy, OnInit, TemplateRef, ViewContainerRef, inject } from '@angular/core';
import { FlAbstractIfDirective } from '@monorepo/front-core-lib';
import { Observable } from 'rxjs';
import { HaSpaceService } from '../../../ha-service/ha-space.service';

@Directive({ selector: '[haIsGencoveryMember]' })
export class HaIsGencoveryMemberDirective extends FlAbstractIfDirective implements OnInit, OnDestroy {
  private spaceService = inject(HaSpaceService);

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

  protected showView(): Observable<boolean> {
    return this.spaceService.isGencoveryMember();
  }
}
