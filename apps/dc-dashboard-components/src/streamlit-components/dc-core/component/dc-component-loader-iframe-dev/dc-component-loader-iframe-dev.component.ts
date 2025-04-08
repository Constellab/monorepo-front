import { Component, ElementRef, inject, OnInit, ViewChild } from '@angular/core';
import { DcCoreMainIframeDirective } from '../../directive/dc-core-main-iframe/dc-core-main-iframe.directive';
import { DcResizeIframeDirective } from '../../directive/dc-resize-iframe/dc-resize-iframe.directive';
import { DcComponentLoaderService } from '../../service/dc-component-loader.service';
import { DcComponentData, DcDynamicComponentEvent } from '../../../../core/model/dc-dynamic-component.class';
import { Streamlit } from 'streamlit-component-lib';

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
  hostDirectives: [DcCoreMainIframeDirective, DcResizeIframeDirective],
  providers: [DcComponentLoaderService],
})
export class DcComponentLoaderIframeDevComponent implements OnInit {
  private mainDirective = inject(DcCoreMainIframeDirective);
  private componentLoaderService = inject(DcComponentLoaderService);

  @ViewChild('div', { static: true }) div: ElementRef<HTMLElement>;

  ngOnInit(): void {
    this.mainDirective.getInitData().subscribe((data) => this.init(data).then());
  }

  private async init(data: DcComponentData): Promise<void> {
    const streamlitEvent = new DcStreamlitEvent();
    // create the component
    // don't listen to element removal because we are in the iframe
    // so we don't have access to the main app and when the iframe is removed
    // the component is removed too
    await this.componentLoaderService.createComponent(data, this.div.nativeElement, streamlitEvent, false);
  }
}
