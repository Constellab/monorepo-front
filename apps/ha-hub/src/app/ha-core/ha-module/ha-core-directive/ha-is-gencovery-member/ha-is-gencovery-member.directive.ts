import { Directive, OnDestroy, OnInit, TemplateRef, ViewContainerRef } from '@angular/core';
import { FlAbstractIfDirective } from '@monorepo/front-core-lib';
import { Observable } from 'rxjs';
import { HaSpaceService } from '../../../ha-service/ha-space.service';

@Directive({
  selector: '[haIsGencoveryMember]',
})
export class HaIsGencoveryMember extends FlAbstractIfDirective implements OnInit, OnDestroy {
  constructor(
    templateRef: TemplateRef<any>,
    viewContainer: ViewContainerRef,
    private spaceService: HaSpaceService
  ) {
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
