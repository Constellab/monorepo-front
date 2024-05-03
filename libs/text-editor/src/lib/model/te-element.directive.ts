import {booleanAttribute, Directive, ElementRef, HostBinding, inject, Input, Renderer2} from '@angular/core';
import {TeHelper} from './te.helper';

/**
 * Parent class for component that are loaded inside the FlTextEditor
 */
@Directive()
export abstract class TeElementDirective {

  /**
   * True if the block is disabled, the editor is in read only mode
   */
  @HostBinding('class.disabled') disabled: boolean;

  /**
   * True if the block was just added to the editor. Used to focus the block or do other actions.
   * False if the block was already in the editor at initialization
   */
  newElement: boolean = false;
}

/**
 * Parent class for component that are loaded inside the FlTextEditor
 */
@Directive()
export abstract class TeElementBlockDirective extends TeElementDirective {

}

/**
 * Parent class for component that are loaded inside the FlTextEditor
 */
@Directive()
export abstract class TeElementInlineDirective<T = any> extends TeElementDirective {

  public static newElementAttribute = 'new-element';
  public static dataAttribute = 'data-jsondata';


  /**
   * True if the block was just added to the editor. Used to focus the block or do other actions.
   * False if the block was already in the editor at initialization
   */
  @HostBinding('attr.' + TeElementInlineDirective.newElementAttribute)
  @Input({transform: booleanAttribute}) override newElement: boolean;

  data: T;

  protected elementRef: ElementRef<HTMLElement> = inject(ElementRef);
  protected renderer: Renderer2 = inject(Renderer2);

  constructor() {
    super();
    this.disabled = !TeHelper.parentBlockParagraphIsEditable(this.elementRef.nativeElement);

    const strData = this.elementRef.nativeElement.getAttribute(TeElementInlineDirective.dataAttribute);
    this.data = JSON.parse(strData);
  }

  public setData(data: T): void {
    this.data = data;
    this.renderer.setAttribute(this.elementRef.nativeElement, TeElementInlineDirective.dataAttribute, JSON.stringify(data));
  }

}
