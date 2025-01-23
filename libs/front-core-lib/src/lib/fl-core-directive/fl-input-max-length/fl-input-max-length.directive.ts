import { Directive, ElementRef, Input, OnDestroy, OnInit, Renderer2, inject } from '@angular/core';
import { ClHelpService } from '@monorepo/core-lib';
import { FlTooltipService } from '@monorepo/front-core-lib/fl-portal';
import { FlPortalDefaultPosition } from '@monorepo/front-core-lib/fl-portal';

/**
 * Directive to be placed in a input or a textarea to limit the length of it and if the user reached
 * the limit, it display a quick tooltip to warn the user that the limit has been reached
 */
@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: 'input[flInputMaxLength], textarea[flInputMaxLength]',
  providers: [FlTooltipService],
  standalone: false,
})
export class FlInputMaxLengthDirective implements OnInit, OnDestroy {
  private elementRef = inject<ElementRef<HTMLInputElement | HTMLTextAreaElement>>(ElementRef);
  private renderer = inject(Renderer2);
  private tooltipService = inject(FlTooltipService);

  /**
   * Max length of the input
   */
  @Input() set flInputMaxLength(length: number | string) {
    this.setInputMaxLength(length);
  }

  /**
   * Duration for the tooltip that show the warnings
   */
  @Input('flInputMaxLengthDuration') duration: number = 2000;

  /**
   * Position of the tooltip relative to the input
   */
  @Input('flInputMaxLengthPosition') position: FlPortalDefaultPosition = 'right';

  private keyUpListener: () => void;

  ngOnInit(): void {
    this.keyUpListener = this.renderer.listen(this.elementRef.nativeElement, 'keyup', () =>
      this.onInputChange()
    );
  }

  // convert max length to number and set it
  private setInputMaxLength(length: number | string): void {
    const maxLength: number = ClHelpService.convertStringOrNumberToNumber(length, -1);

    if (maxLength === -1) {
      this.renderer.removeAttribute(this.elementRef.nativeElement, 'maxlength');
    } else {
      this.elementRef.nativeElement.maxLength = maxLength;
    }
  }

  private onInputChange(): void {
    if (
      this.elementRef.nativeElement.maxLength !== -1 &&
      (this.elementRef.nativeElement.value?.length ?? 0) >= this.elementRef.nativeElement.maxLength
    ) {
      this.openTooltipPortal();
    }
  }

  // open the portal if it doesn't already exist
  private openTooltipPortal(): void {
    this.tooltipService.openTooltipWithTranslate(
      this.elementRef,
      'input_max_length',
      [this.position],
      'flInputMaxLength',
      this.duration,
      { param: { count: this.elementRef.nativeElement.maxLength } }
    );
  }

  ngOnDestroy(): void {
    if (this.keyUpListener) {
      this.keyUpListener();
    }
  }
}
