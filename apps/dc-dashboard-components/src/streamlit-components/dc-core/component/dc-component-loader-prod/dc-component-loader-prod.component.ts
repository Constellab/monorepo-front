import { Component, inject, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import {
  DcIframeToMainEventListener,
  DcMainToIframeEventResponse,
} from '../../../../core/iframe-event/dc-iframe-event-listener.class';
import {
  dcGetIframeMessageHost,
  DcIframeEventAction,
  DcIframeEventInitData,
} from '../../../../core/iframe-event/dc-iframe-event.class';
import { DcMainToIframeEventEmitter } from '../../../../core/iframe-event/dc-iframe-event-emitter.class';
import { DcComponentLoaderService } from '../../service/dc-component-loader.service';
import { FlThemeService } from '@monorepo/front-core-lib/fl-theme';

@Component({
  selector: 'dc-root',
  imports: [],
  templateUrl: './dc-component-loader-prod.component.html',
  styleUrl: './dc-component-loader-prod.component.scss',
  providers: [DcComponentLoaderService],
})
export class DcComponentLoaderProdComponent implements OnInit, OnDestroy {
  private document: Document = inject(DOCUMENT);
  private componentLoaderService = inject(DcComponentLoaderService);
  private renderer = inject(Renderer2);
  private themeService = inject(FlThemeService);

  private iframeEventListener: DcIframeToMainEventListener;

  ngOnInit(): void {
    this.iframeEventListener = new DcIframeToMainEventListener(
      dcGetIframeMessageHost(),
      this.renderer,
      window
    );
    this.iframeEventListener.listenToIframeEvents().subscribe((event) => this.onIframeMessage(event));
  }

  private onIframeMessage(event: DcMainToIframeEventResponse): void {
    switch (event.data.action) {
      case DcIframeEventAction.INIT:
        this.handInitEvent(event.data.data, event.origin).then();
        break;
      default:
        console.error('Unknown action:', event.data.action);
    }
  }

  /**
   * Trigger when the iframe component was initialized
   * We create a component alongside the iframe
   * @private
   */
  private async handInitEvent(data: DcIframeEventInitData, origin: string): Promise<void> {
    // set the theme from the iframe
    this.themeService.changeTheme(data.theme);

    // Get the container element
    const containerClass = data.componentData.container_class;
    if (!containerClass) {
      console.error('Container_class not found in the init message data');
      return;
    }

    const container: HTMLElement = this.document.querySelector(`.${containerClass}`);
    if (!container) {
      console.error(`Container with class ${containerClass} not found`);
      return;
    }

    const iframeEvent = new DcMainToIframeEventEmitter(
      origin,
      data.componentData.container_class,
      this.document
    );
    await this.componentLoaderService.createComponent(data.componentData, container, iframeEvent, true);
  }

  ngOnDestroy(): void {
    if (this.iframeEventListener) {
      this.iframeEventListener.destroy();
    }
  }
}
