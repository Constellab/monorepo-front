import { Directive, OnDestroy, OnInit, TemplateRef, ViewContainerRef, inject } from '@angular/core';
import { FlAbstractIfDirective } from '@monorepo/front-core-lib';
import { LabEnvStore } from '../service/lab-env.store';

/**
 * Template directive to show the content only if the environment is dev
 */
@Directive({ selector: '[labEnvDev]' })
export class LabEnvDevDirective extends FlAbstractIfDirective implements OnInit, OnDestroy {
  private labEnvStore = inject(LabEnvStore);

  constructor() {
    const templateRef = inject<TemplateRef<any>>(TemplateRef);
    const viewContainer = inject(ViewContainerRef);

    super(templateRef, viewContainer);
  }

  ngOnInit(): void {
    super.ngOnInit();
  }

  protected showView(): boolean {
    return this.labEnvStore.isDev();
  }

  ngOnDestroy(): void {
    super.ngOnDestroy();
  }
}
