import { ComponentRef } from '@angular/core';
import { Subscription } from 'rxjs';
import {
  DcComponentData,
  DcDynamicComponent,
  DcDynamicComponentEvent,
} from '../../../core/model/dc-dynamic-component.class';

export class DcLoadedComponent {
  private observer: MutationObserver;
  private subscription: Subscription;

  constructor(
    public readonly id: string,
    private element: HTMLElement,
    private componentRef: ComponentRef<DcDynamicComponent>,
    private componentEvent: DcDynamicComponentEvent
  ) {}

  public setInput(data: DcComponentData): void {
    // set the input data to the component
    this.componentRef.setInput('inputData', data);
  }

  public listenToComponentOutput(): void {
    // subscribe to the output event to transmit data
    this.subscription = this.componentRef.instance.outputEvent.subscribe((data: any) =>
      this.componentEvent.setComponentValue(data)
    );
  }

  public listenToElementRemoval(): void {
    // Create a parent observer
    this.observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.removedNodes.forEach((node) => {
          if (node === this.element || node.contains(this.element)) {
            this.destroyComponent();
          }
        });
      });
    });

    // Start observing the parent element
    this.observer.observe(this.element.parentNode, {
      childList: true,
      subtree: true,
    });
  }

  public destroyComponent(): void {
    if (this.componentRef) {
      this.componentRef.destroy();
      this.componentRef = undefined;
    }
    if (this.observer) {
      this.observer.disconnect();
      this.observer = undefined;
    }
    if (this.subscription) {
      this.subscription.unsubscribe();
      this.subscription = undefined;
    }
  }
}
