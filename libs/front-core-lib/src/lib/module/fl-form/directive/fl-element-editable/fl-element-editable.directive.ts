import {
  Directive,
  ElementRef,
  EventEmitter,
  HostBinding,
  HostListener,
  Input,
  OnChanges,
  Output,
  Renderer2,
  SimpleChanges
} from '@angular/core';
import {DateTime} from 'luxon';
import {ClDateHelper} from '@monorepo/core-lib';
import {FlKeyboardKey} from '../../../../utils/fl-keyboard.helper';

@Directive({
  selector: '[flElementEditable]',
})
export class FlElementEditableDirective implements OnChanges {

  /**
   * Make element editable
   */
  @HostBinding('class.g-fl-element-editable-true')
  @Input() flElementEditable: boolean | string = false;

  @Output() flElementEditableChange: EventEmitter<boolean> = new EventEmitter<boolean>();

  /**
   * When true, the click event is not used but mouse up and down are used to trigger editable.
   * The editable is then ony trigger if the mouse down event last less than 200ms.
   * This is used to avoid editable to be trigger when user is dragging the element.
   * This can be used for portal title for example
   */
  @Input() flElementIgnoreDrag: boolean = false;

  /**
   * Disable editable element
   */
  @HostBinding('class.g-fl-element-editable-disabled')
  @Input() flElementDisabled: boolean = false;

  @Input() flIgnoreEnterKey: boolean = false;

  @Input() flElementValue: string = null;

  /**
   * Event triggered on blur event with the new text value
   */
  @Output() flElementValueChange: EventEmitter<string> = new EventEmitter<string>();

  private mouseDownTime: DateTime;

  private readonly mouseDownThreshold: number = 200;

  private previousValue: string;

  @HostListener('mousedown', ['$event']) onMouseDown(): void {
    if (this.flElementDisabled || !this.flElementIgnoreDrag) return;
    this.mouseDownTime = ClDateHelper.getDate();
  }

  // only trigger when click down last for less than 500ms
  @HostListener('mouseup', ['$event']) onMouseUp(): void {
    if (this.flElementDisabled || !this.flElementIgnoreDrag) return;
    const mouseUpTime = ClDateHelper.getDate();
    const diff = mouseUpTime.diff(this.mouseDownTime, 'milliseconds').milliseconds;
    if (diff < this.mouseDownThreshold) {
      this.setEditable();
    }
    this.mouseDownTime = null;
  }

  @HostListener('click', ['$event']) onClick(): void {
    if (this.flElementDisabled || this.flElementIgnoreDrag) return;
    this.setEditable();
  }

  @HostListener('blur', ['$event']) onBlur(): void {
    this.setNotEditable();
  }

  // listen to Enter key to trigger blur
  @HostListener('keydown', ['$event']) onKeyDown(event: KeyboardEvent): void {
    if (event.key === FlKeyboardKey.ENTER && !this.flIgnoreEnterKey) {
      event.preventDefault();
      this.setNotEditable();
    }
  }

  @HostListener('paste', ['$event']) onPaste(event: ClipboardEvent): void {
    event.preventDefault();

    let text = event.clipboardData.getData('text/plain');

    this.setTextFormatted(text);
  }

  constructor(private elementRef: ElementRef,
              private renderer: Renderer2) {
    // add a default class to the element
    renderer.addClass(elementRef.nativeElement, 'g-fl-element-editable');
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['flElementValue']) {
      this.updateContent(this.flElementValue);
    }
  }

  private setEditable(): void {
    this.flElementEditable = true;
    this.flElementEditableChange.emit(this.flElementEditable);
    this.renderer.setAttribute(this.elementRef.nativeElement, 'contentEditable', 'true');
    this.elementRef.nativeElement.focus();
    this.previousValue = this.elementRef.nativeElement.innerText;
  }

  private setNotEditable(): void {
    this.flElementEditable = false;
    this.flElementEditableChange.emit(this.flElementEditable);
    this.renderer.removeAttribute(this.elementRef.nativeElement, 'contentEditable');

    // only emit if value has changed
    if (this.previousValue !== this.elementRef.nativeElement.innerText) {
      this.flElementValueChange.emit(this.elementRef.nativeElement.innerText);
    }
  }

  private setTextFormatted(text: string): void {
    if (document.execCommand) {
      document.execCommand('insertText', false, text);
    } else {
      const range = window.getSelection().getRangeAt(0);
      range.deleteContents();
      range.insertNode(document.createTextNode(text));
    }
  }

  private updateContent(content: string): void {
    // Vous pouvez transformer le contenu ici si nécessaire, par exemple :
    // Remplacer les retours à la ligne et les tabulations
    const formattedContent = content?.replace(/\n/g, '\n').replace(/\t/g, '\t');

    // Mettre à jour le contenu de l'élément
    this.elementRef.nativeElement.innerText = formattedContent;
  }
}
