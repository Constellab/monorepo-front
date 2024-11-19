import { Component, input, OnInit, OutputEmitterRef } from '@angular/core';
import { FlDynamicAbstractFormDirective } from '../../model/fl-dynamic-abstract-form.directive';
import { FlDynamicEditableFormGroupConfig } from '../../model/fl-dynamic-field-config.class';
import { UntypedFormGroup } from '@angular/forms';

@Component({
  selector: 'fl-dynamic-editable-form-group',
  templateUrl: './fl-dynamic-editable-form-group.component.html',
  styleUrl: './fl-dynamic-editable-form-group.component.scss',
})
export class FlDynamicEditableFormGroupComponent implements OnInit, FlDynamicAbstractFormDirective {
  /**
   * Form where control will be added
   */
  control = input<UntypedFormGroup>();

  config = input<FlDynamicEditableFormGroupConfig>();

  openEditParamSpecsDialog: OutputEmitterRef<void>;

  constructor() {}

  ngOnInit(): void {}

  emitOpenEditParamSpecsDialog(): void {
    this.openEditParamSpecsDialog.emit();
  }
}
