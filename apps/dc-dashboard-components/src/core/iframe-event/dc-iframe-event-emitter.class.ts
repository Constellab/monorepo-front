import { DcDynamicComponentEvent } from '../model/dc-dynamic-component.class';
import {
  DcIframeEventAction,
  DcIframeEventInitData,
  dcIframeEventType,
  DcIframeToMainEvent,
  DcMainToIframeEvent,
} from './dc-iframe-event.class';

/**
 * Class to handle emission of events from the iframe to the main app
 */
export class DcIframeToMainEventEmitter {
  constructor(private mainOrigin: string) {}

  public initComponent(data: DcIframeEventInitData): void {
    // Send the message to the parent
    const event: DcIframeToMainEvent = {
      type: dcIframeEventType,
      action: DcIframeEventAction.INIT,
      data: data,
    };
    window.parent.postMessage(event, this.mainOrigin);
  }
}

/**
 * Class to handle emission of events from the main app to the iframe
 */
export class DcMainToIframeEventEmitter implements DcDynamicComponentEvent {
  constructor(
    private iframeOrigin: string,
    private containerClass: string,
    private document: Document
  ) {}

  public setComponentValue(jsonData: any): void {
    const iframeElement = this.getIframeElement();
    // Send the message to the iframe
    const event: DcMainToIframeEvent = {
      type: dcIframeEventType,
      action: DcIframeEventAction.SET_COMPONENT_VALUE,
      data: jsonData,
    };
    iframeElement.contentWindow.postMessage(event, this.iframeOrigin);
  }

  private getIframeElement(): HTMLIFrameElement {
    // Get the container element
    const container = this.document.querySelector(`.${this.containerClass}`);
    if (!container) {
      throw Error(`Container with class ${this.containerClass} not found`);
    }

    // get the iframe inside the container
    const iframe = container.querySelector('iframe');
    if (!iframe) {
      throw Error(`Iframe not found inside container with class ${this.containerClass}`);
    }
    return iframe as HTMLIFrameElement;
  }
}
