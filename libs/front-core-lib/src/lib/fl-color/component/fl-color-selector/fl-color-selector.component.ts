import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { NgControl } from '@angular/forms';
import { FlColorHelper, FlFormFieldDirective } from '@monorepo/front-core-lib/fl-core';

@Component({
  selector: 'fl-color-selector',
  templateUrl: './fl-color-selector.component.html',
  styleUrls: ['./fl-color-selector.component.scss'],
  providers: [{ provide: FlFormFieldDirective, useExisting: FlColorSelectorComponent }],
  standalone: false,
})
export class FlColorSelectorComponent extends FlFormFieldDirective<string> {
  @Input() placeholder: string;

  @Input() availableColor: string[] = FlColorHelper.getColorList();

  /**
   * Color of the check text for the selected color
   */
  @Input() checkSelectedColor: string = 'white';

  /**
   * Border color for the colored box
   */
  @Input() boxBorderColor: string = 'transparent';

  @Output() colorChange: EventEmitter<string> = new EventEmitter();

  constructor() {
    const ngControl = inject(NgControl, { optional: true, self: true });

    super(ngControl);
  }

  callChangeEvent(value: string): void {
    this.colorChange.emit(value);
  }

  writeValue(obj: any): void {
    this.value = obj;
  }

  selectColor(color: string): void {
    if (!this.disabled) {
      // if the color was already selected, clear it
      if (this.isSelected(color)) {
        this.setAndEmitValue(null);
      } else {
        this.setAndEmitValue(color);
      }
    }

    this.markAsTouched();
  }

  isSelected(color: string): boolean {
    return this.value === color;
  }

  onDisableChange(): void {}
}
