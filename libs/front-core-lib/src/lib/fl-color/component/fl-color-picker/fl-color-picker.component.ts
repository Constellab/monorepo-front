import { Component, input, inject } from '@angular/core';
import { NgControl } from '@angular/forms';
import { FlFormFieldDirective } from '@monorepo/front-core-lib/fl-core';

@Component({
  selector: 'fl-color-picker',
  templateUrl: './fl-color-picker.component.html',
  styleUrl: './fl-color-picker.component.scss',
  providers: [{ provide: FlFormFieldDirective, useExisting: FlColorPickerComponent }],
  standalone: false,
})
export class FlColorPickerComponent extends FlFormFieldDirective<string> {
  constructor() {
    const ngControl = inject(NgControl, { optional: true, self: true });

    super(ngControl);
  }

  tooltip = input<string>('flColor.select_color');

  size = input<string>('40px');

  callChangeEvent(value: string): void {}

  onDisableChange(disable: boolean): void {
    this.disabled = disable;
  }

  writeValue(obj: string): void {
    this.value = obj;
  }

  onInputChange(value: string): void {
    this.setAndEmitValue(value);
  }
}
