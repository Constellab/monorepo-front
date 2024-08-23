import { BehaviorSubject, debounceTime, Observable } from 'rxjs';
import { distinctUntilChanged } from 'rxjs/operators';

/**
 * Listener to create for a TextNode at a specific key trigger event. It emits
 * the text between the trigger key and the cursor position.
 */
export class TeKeyListener {

  private text$: BehaviorSubject<string> = new BehaviorSubject<string>('');

  private listener: (event: KeyboardEvent) => void;

  private completed: boolean = false;

  /**
   *
   * @param textNode text node where the cursor is
   * @param initialCursorOffset initial cursor offset
   * @param triggerKey key used to trigger the listener
   * @param stopListenKeys keys that will stop the listener
   */
  constructor(private textNode: Node,
              private initialCursorOffset: number,
              private triggerKey: string,
              private stopListenKeys: string[]) {
    this.listen();
  }

  private listen(): void {
    // listen to keyup event on the parent, which is a real HTML element
    this.listener = (event: KeyboardEvent) => this.onKeyUp(event);
    // use document listener so we can close the listener when the cursor is not on the text node
    document.addEventListener('keyup', this.listener);
  }

  private onKeyUp(event: KeyboardEvent): void {
    const selection = window.getSelection();
    const range = selection.getRangeAt(0);
    const textNode = range.endContainer;

    /**
     * If the cursor is on another text element or the cursor is before the initial cursor position
     * we destroy the listener
     */
    if (textNode !== this.textNode || range.endOffset < this.initialCursorOffset) {
      this.destroy();
      return;
    }

    if (this.stopListenKeys.includes(event.key)) {
      this.destroy();
    } else {
      this.text$.next(this.getText());
    }
  }

  private getText(): string {
    const selection = window.getSelection();
    const range = selection.getRangeAt(0);
    const node = range.endContainer;
    const offset = range.endOffset;

    // get the text between  the last trigger key and the cursor
    return node.textContent.slice(0, offset).split(this.triggerKey).pop();
  }

  public getText$(): Observable<string> {
    return this.text$.asObservable().pipe(
      distinctUntilChanged(),
      debounceTime(350)
    );
  }

  public getCurrentText(): string {
    return this.text$.value;
  }

  public destroy(): void {
    this.text$.complete();
    this.completed = true;
    document.removeEventListener('keyup', this.listener);
  }

  /**
   * return the index position of the search text in the text node
   */
  public getSearchTextPosition(): { start: number, end: number } {
    return {
      start: this.initialCursorOffset,
      end: this.initialCursorOffset + this.getCurrentText().length + this.triggerKey.length
    };
  }

  public isCompleted(): boolean {
    return this.completed;
  }

}
