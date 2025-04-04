import { Renderer2 } from '@angular/core';
import { filter, map, Observable, Subject } from 'rxjs';
import {
  DcIframeEventAction,
  dcIframeEventType,
  DcIframeToMainEvent,
  DcMainToIframeEvent,
} from './dc-iframe-event.class';

/**
 * Class to simplify the listen of messages between
 * Iframe and main app
 */
export class DcIframeEventListener {
  private messageListener: () => void;
  protected subject: Subject<MessageEvent> = new Subject();

  constructor(
    private expectedOrigin: string,
    private renderer: Renderer2,
    private window: Window
  ) {
    this.listenToEvent();
  }

  private listenToEvent(): void {
    this.messageListener = this.renderer.listen(this.window, 'message', (event: MessageEvent) =>
      this.subject.next(event)
    );
  }

  protected getEvents(): Observable<MessageEvent> {
    return this.subject.pipe(filter((event: MessageEvent) => this.checkEvent(event.origin, event.data.type)));
  }

  private checkEvent(origin: string, type: string): boolean {
    // Verify the origin of the message
    if (this.expectedOrigin !== '*' && !origin.startsWith(this.expectedOrigin)) {
      console.warn('Origin not allowed:', origin);
      return false;
    }

    // Check if the event is of type dcIframeEventType
    return type === dcIframeEventType;
  }

  public destroy(): void {
    if (this.messageListener) {
      this.messageListener();
      this.messageListener = undefined;
    }
  }
}

export interface DcMainToIframeEventResponse {
  origin: string;
  data: DcIframeToMainEvent;
}

export class DcIframeToMainEventListener extends DcIframeEventListener {
  public listenToIframeEvents(): Observable<DcMainToIframeEventResponse> {
    return this.getEvents().pipe(
      filter((event: MessageEvent) => event.data.action === DcIframeEventAction.INIT),
      map((event: MessageEvent) => {
        return {
          origin: event.origin,
          data: event.data,
        };
      })
    );
  }
}

export class DcMainToIframeEventListener extends DcIframeEventListener {
  public listenToIframeEvents(): Observable<DcMainToIframeEvent> {
    return this.getEvents().pipe(
      filter((event: MessageEvent) => event.data.action === DcIframeEventAction.SET_COMPONENT_VALUE),
      map((event: MessageEvent) => event.data as DcMainToIframeEvent)
    );
  }
}
