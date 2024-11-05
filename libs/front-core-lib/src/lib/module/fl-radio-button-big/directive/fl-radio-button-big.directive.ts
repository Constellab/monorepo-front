import { Directive, HostBinding, HostListener } from '@angular/core';
import { MatRadioButton } from '@angular/material/radio';

/**
 * Directive to make a radio button big.
 * It applies style and manage click event
 */
@Directive({
  selector: '[flRadioButtonBig]',
})
export class FlRadioButtonBigDirective {
  @HostBinding('class.g-mat-radio-button-big') big = true;

  constructor(private matRadioButton: MatRadioButton) {}

  // onclick event
  @HostListener('click', ['$event']) onClick(event: MouseEvent): void {
    if (!this.matRadioButton.disabled) {
      // simulate click on the radio button
      this.matRadioButton._onTouchTargetClick(event);
    }
  }
}
