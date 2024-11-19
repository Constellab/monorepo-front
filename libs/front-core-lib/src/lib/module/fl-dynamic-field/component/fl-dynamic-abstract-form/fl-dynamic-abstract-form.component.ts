import {
  Component,
  ComponentRef,
  effect,
  input,
  OnDestroy,
  OnInit,
  output,
  Type,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { FlDynamicFormAbstractControl } from '../../model/fl-dynamic-field-config.class';
import { AbstractControl } from '@angular/forms';
import { FlDynamicFieldComponent } from '../fl-dynamic-field/fl-dynamic-field.component';
import { FlDynamicFormGroupComponent } from '../fl-dynamic-form-group/fl-dynamic-form-group.component';
import { FlDynamicFormArrayComponent } from '../fl-dynamic-form-array/fl-dynamic-form-array.component';
import { FlDynamicAbstractFormDirective } from '../../model/fl-dynamic-abstract-form.directive';
import { FlDynamicEditableFormGroupComponent } from '../fl-dynamic-editable-form-group/fl-dynamic-editable-form-group.component';

/**
 * Component to generate a FormGroup, FormArray or FormControl form base on config
 */
@Component({
  selector: 'fl-dynamic-abstract-form',
  templateUrl: './fl-dynamic-abstract-form.component.html',
  styleUrls: ['./fl-dynamic-abstract-form.component.scss'],
})
export class FlDynamicAbstractFormComponent implements OnDestroy {
  config = input<FlDynamicFormAbstractControl>();

  control = input<AbstractControl>();

  openEditParamSpecsDialog = output();

  @ViewChild('viewContainer', { static: true, read: ViewContainerRef }) viewContainer: ViewContainerRef;

  private viewComponentRef: ComponentRef<FlDynamicAbstractFormDirective>;

  constructor() {
    effect(() => {
      this.ngOnDestroy();
      this.viewComponentRef = this.viewContainer.createComponent(this.getComponentType());
      this.viewComponentRef.instance.config = this.config;
      this.viewComponentRef.instance.control = this.control;
      this.viewComponentRef.instance.openEditParamSpecsDialog = this.openEditParamSpecsDialog;
    });
  }

  private getComponentType(): Type<FlDynamicAbstractFormDirective> {
    switch (this.config().controlType) {
      case 'formControl':
        return FlDynamicFieldComponent;
      case 'formGroup':
        return FlDynamicFormGroupComponent;
      case 'formArray':
        return FlDynamicFormArrayComponent;
      case 'editableFormGroup':
        return FlDynamicEditableFormGroupComponent;
    }
  }

  ngOnDestroy(): void {
    this.viewComponentRef?.destroy();
  }
}
