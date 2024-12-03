import { Component, input, OnInit } from '@angular/core';
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

  configName = input<string>();

  constructor() {}

  ngOnInit(): void {}

  emitOpenEditParamSpecsDialog(): void {
    this.config().openEditConfigDialog.emit(this.configName());
  }
}
