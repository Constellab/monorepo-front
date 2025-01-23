import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlFormFieldComponent } from './component/fl-form-field/fl-form-field.component';
import { FlElementEditableDirective } from './directive/fl-element-editable/fl-element-editable.directive';

/**
 * Modules containing components for forms
 */
@NgModule({
  declarations: [FlFormFieldComponent, FlElementEditableDirective],
  exports: [FlFormFieldComponent, FlElementEditableDirective],
  imports: [CommonModule],
})
export class FlFormModule {}
