import {
  Directive,
  effect,
  EmbeddedViewRef,
  input,
  TemplateRef,
  ViewContainerRef,
  inject,
} from '@angular/core';

/**
 * Directive to recreate a view when the input change. It allows to recreate component when the input changes.
 */
@Directive({
  selector: '[flRecreateView]',
  standalone: false,
})
export class FlRecreateViewDirective {
  private templateRef = inject<TemplateRef<any>>(TemplateRef);
  private viewContainer = inject(ViewContainerRef);

  flRecreateView = input.required<any>();

  viewRef: EmbeddedViewRef<any>;

  constructor() {
    effect(() => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const _ = this.flRecreateView();
      if (this.viewRef) {
        this.destroyView();
      }
      this.createView();
    });
  }

  private createView(): void {
    this.viewRef = this.viewContainer.createEmbeddedView(this.templateRef);
  }

  private destroyView(): void {
    this.viewRef.destroy();
    this.viewRef = null;
  }
}
