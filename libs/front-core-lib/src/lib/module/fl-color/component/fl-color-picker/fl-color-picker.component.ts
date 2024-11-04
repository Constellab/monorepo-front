import { Component, input, Optional, Self } from '@angular/core';
import { FlFormFieldDirective } from '../../../../abstract-directive/form/fl-form-field.directive';
import { NgControl } from '@angular/forms';

@Component({
  selector: 'fl-color-picker',
  templateUrl: './fl-color-picker.component.html',
  styleUrl: './fl-color-picker.component.scss',
  providers: [
    { provide: FlFormFieldDirective, useExisting: FlColorPickerComponent },
  ],
})
export class FlColorPickerComponent extends FlFormFieldDirective<string> {
  constructor(@Optional() @Self() ngControl: NgControl) {
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
