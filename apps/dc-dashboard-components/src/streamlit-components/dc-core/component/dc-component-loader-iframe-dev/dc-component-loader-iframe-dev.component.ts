import { Component, ElementRef, inject, OnInit, ViewChild } from '@angular/core';
import { ClTheme } from '@monorepo/core-lib';
import { FlThemeService } from '@monorepo/front-core-lib/fl-theme';
import { RenderData, Streamlit } from 'streamlit-component-lib';

import { DcComponentData, DcDynamicComponentEvent } from '../../../../core/model/dc-dynamic-component.class';
import { DcResizeIframeDirective } from '../../directive/dc-resize-iframe/dc-resize-iframe.directive';
import { DcComponentLoaderService } from '../../service/dc-component-loader.service';

/**
 * Class to transfer the dynamic component output to the streamlit component
 */
export class DcStreamlitEvent implements DcDynamicComponentEvent {
  setComponentValue(jsonData: any): void {
    Streamlit.setComponentValue(jsonData);
  }
}

/**
 * Component that is run in the iframe component in dev mode.
 * This is used when you want to test a component in dev mode in a streamlit app.
 * It creates a big padding sor portal and dialog are visible.
 * This is not a problem in prod environment because the component is not running in the iframe.
 */
@Component({
  selector: 'dc-root',
  imports: [],
  templateUrl: './dc-component-loader-iframe-dev.component.html',
  styleUrl: './dc-component-loader-iframe-dev.component.scss',
  hostDirectives: [DcResizeIframeDirective],
  providers: [DcComponentLoaderService],
})
export class DcComponentLoaderIframeDevComponent implements OnInit {
  private componentLoaderService = inject(DcComponentLoaderService);

  private themeService = inject(FlThemeService);

  @ViewChild('div', { static: true }) div: ElementRef<HTMLElement>;

  private lastTimestamp: number = 0;

  ngOnInit(): void {
    Streamlit.events.addEventListener(Streamlit.RENDER_EVENT, (event: Event) => {
      const customEvent: CustomEvent<RenderData> = event as CustomEvent<RenderData>;

      const clTheme: ClTheme =
        customEvent.detail.theme.base === 'dark' ? ClTheme.DARK_THEME : ClTheme.LIGHT_THEME;
      this.themeService.changeTheme(clTheme);

      const data: DcComponentData = customEvent.detail.args;
      if (this.lastTimestamp === data.timestamp) {
        return; // avoid reloading the component if the timestamp is the same
      }
      this.lastTimestamp = data.timestamp;
      this.init(data).then();
    });

    Streamlit.setComponentReady();
  }

  private async init(data: DcComponentData): Promise<void> {
    const streamlitEvent = new DcStreamlitEvent();
    // create the component
    // don't listen to element removal because we are in the iframe
    // so we don't have access to the main app and when the iframe is removed
    // the component is removed too
    await this.componentLoaderService.createOrUpdateComponent(data, this.div.nativeElement, streamlitEvent);
  }
}
