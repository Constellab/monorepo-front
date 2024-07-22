import {Observable, Subject} from 'rxjs';
import {TeConfigEvent} from './te-config.class';

// Event class to handle the events incoming and outgoing from the text editor
export class TeEvent{
  // Incoming events
  private events: Subject<TeConfigEvent> = new Subject();

  // Event to notify that the text editor HTML is initiated
  private textEditorHTMLInit: Subject<boolean> = new Subject();

  public addEvent(event: TeConfigEvent): void {
    this.events.next(event);
  }

  public getEvent$(): Observable<TeConfigEvent> {
    return this.events.asObservable();
  }

  public htmlIsInitiated(): void {
    this.textEditorHTMLInit.next(true);
  }

  public isTextEditorHTMLInit$(): Observable<boolean> {
    return this.textEditorHTMLInit.asObservable();
  }

  public destroy(): void {
    this.events.complete();
    this.textEditorHTMLInit.complete();
  }
}
