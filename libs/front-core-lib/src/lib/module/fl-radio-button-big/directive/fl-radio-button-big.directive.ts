import { Directive, HostBinding, HostListener, inject } from '@angular/core';
import { MatRadioButton } from '@angular/material/radio';

/**
 * Directive to make a radio button big.
 * It applies style and manage click event
 */
@Directive({
  selector: '[flRadioButtonBig]',
  standalone: false,
})
export class FlRadioButtonBigDirective {
  private matRadioButton = inject(MatRadioButton);

  @HostBinding('class.g-mat-radio-button-big') big = true;

  // onclick event
  @HostListener('click', ['$event']) onClick(event: MouseEvent): void {
    if (!this.matRadioButton.disabled) {
      // simulate click on the radio button
      this.matRadioButton._onTouchTargetClick(event);
    }
  }
}
