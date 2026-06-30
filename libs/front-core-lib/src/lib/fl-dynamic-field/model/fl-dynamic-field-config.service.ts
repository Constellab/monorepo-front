import { ComponentRef, Injectable, ViewContainerRef } from '@angular/core';
import { AbstractControl, FormControl } from '@angular/forms';
import { DateTime } from 'luxon';

import { FlDynamicFieldComponent } from '../component/fl-dynamic-field/fl-dynamic-field.component';
import { FlDynamicFieldBooleanComponent } from '../component/fl-dynamic-field-boolean/fl-dynamic-field-boolean.component';
import { FlDynamicFieldDateComponent } from '../component/fl-dynamic-field-date/fl-dynamic-field-date.component';
import { FlDynamicFieldInputComponent } from '../component/fl-dynamic-field-input/fl-dynamic-field-input.component';
import { FlDynamicFieldListComponent } from '../component/fl-dynamic-field-list/fl-dynamic-field-list.component';
import { FlDynamicFieldSelectComponent } from '../component/fl-dynamic-field-select/fl-dynamic-field-select.component';
import { FlDynamicFieldSelectSearchComponent } from '../component/fl-dynamic-field-select-search/fl-dynamic-field-select-search.component';
import { FlDynamicFieldTextareaComponent } from '../component/fl-dynamic-field-textarea/fl-dynamic-field-textarea.component';
import { FlDynamicFormArrayComponent } from '../component/fl-dynamic-form-array/fl-dynamic-form-array.component';
import { FlDynamicFormGroupComponent } from '../component/fl-dynamic-form-group/fl-dynamic-form-group.component';
import { FlDynamicAbstractFormDirective } from './fl-dynamic-abstract-form.directive';
import { FlDynamicFieldAbstractDirective } from './fl-dynamic-field-abstract.directive';
import {
  FlDynamicFieldConfig,
  FlDynamicFieldConfigBase,
  FlDynamicFieldConfigDate,
  FlDynamicFieldConfigInput,
  FlDynamicFieldConfigList,
  FlDynamicFieldConfigSelect,
  FlDynamicFieldConfigSelectSearch,
  FlDynamicFormAbstractControl,
} from './fl-dynamic-field-config.class';

/**
 * Function to create a custom component for a field type
 */
export type FlDynamicFieldAdditionalConfig = (
  viewContainer: ViewContainerRef,
  config: FlDynamicFieldConfigBase
) => Promise<ComponentRef<FlDynamicFieldAbstractDirective>>;

/**
 * Function to create a custom component for a group type
 */
export type FlDynamicGroupAdditionalConfig = (
  viewContainer: ViewContainerRef,
  config: FlDynamicFormAbstractControl
) => ComponentRef<FlDynamicAbstractFormDirective>;

/**
 * Configuration for the {@link FlDynamicFieldComponent}
 * Override the getAdditionalConfig method to add new field type
 */
@Injectable({
  providedIn: 'root',
})
export class FlDynamicFieldConfigService {
  /**
   * return custom additional config for the field.
   * Key = type {@link FlDynamicFieldConfig}
   * @protected
   */
  protected getAdditionalFieldConfig(): Record<string, FlDynamicFieldAdditionalConfig> {
    return {};
  }

  private isAdditionalType(type: string): boolean {
    return this.getAdditionalFieldConfig()[type] != null;
  }

  /**
   * Generate the component from the config of the field
   * @param config
   * @param viewContainer
   * @param formCtrl
   */
  public async generateFieldComponent(
    config: FlDynamicFieldConfig,
    viewContainer: ViewContainerRef,
    formCtrl: FormControl,
    cellRendering = false
  ): Promise<ComponentRef<FlDynamicFieldAbstractDirective>> {
    let viewComponentRef: ComponentRef<FlDynamicFieldAbstractDirective>;
    // if the type is supported by the module config, use it
    if (this.isAdditionalType(config.type)) {
      const additionalConfig = this.getAdditionalFieldConfig()[config.type];
      viewComponentRef = await additionalConfig(viewContainer, config);
    } else {
      switch (config.type) {
        case 'input':
          viewComponentRef = this.createInputComponent(viewContainer, config as FlDynamicFieldConfigInput);
          break;
        case 'select':
          viewComponentRef = this.createSelectComponent(viewContainer, config as FlDynamicFieldConfigSelect);
          break;
        case 'select-search':
          viewComponentRef = this.createSelectSearchComponent(
            viewContainer,
            config as FlDynamicFieldConfigSelectSearch
          );
          break;
        case 'list':
          viewComponentRef = this.createListComponent(viewContainer, config as FlDynamicFieldConfigList);
          break;
        case 'boolean':
          viewComponentRef = this.createBooleanComponent(viewContainer);
          break;
        case 'textarea':
          viewComponentRef = this.createTextareaComponent(viewContainer);
          break;
        case 'date':
          viewComponentRef = this.createDateComponent(viewContainer, config as FlDynamicFieldConfigDate);
          break;
        default:
          throw new Error('Unknown type: ' + config.type);
      }
    }

    // add generic properties (signal inputs -> must use setInput)
    viewComponentRef.setInput('formCtrl', formCtrl);
    viewComponentRef.setInput('placeholder', config.placeholder);
    viewComponentRef.setInput('hint', config.hint);
    viewComponentRef.setInput('disabled', !!config.disabled);
    viewComponentRef.setInput('required', !!config.required);
    viewComponentRef.setInput('cellRendering', cellRendering);

    return viewComponentRef;
  }

  private createInputComponent(
    viewContainer: ViewContainerRef,
    config: FlDynamicFieldConfigInput
  ): ComponentRef<FlDynamicFieldAbstractDirective> {
    const inputComponent = viewContainer.createComponent(FlDynamicFieldInputComponent);
    inputComponent.setInput('prefix', config.prefix);
    inputComponent.setInput('suffix', config.suffix);
    inputComponent.setInput('inputType', config.inputType);
    inputComponent.setInput('min', config.min);
    inputComponent.setInput('max', config.max);
    inputComponent.setInput('integer', config.integer);
    inputComponent.setInput('minLength', config.minLength);
    inputComponent.setInput('maxLength', config.maxLength);
    inputComponent.setInput('regex', config.regex);
    inputComponent.setInput('regexDescription', config.regexDescription);
    return inputComponent;
  }

  private createSelectComponent(
    viewContainer: ViewContainerRef,
    config: FlDynamicFieldConfigSelect
  ): ComponentRef<FlDynamicFieldAbstractDirective> {
    const selectComponent = viewContainer.createComponent(FlDynamicFieldSelectComponent);
    selectComponent.setInput('selectOptionsInput', config.selectOptions);
    selectComponent.setInput('multiple', !!config.multiple);
    selectComponent.setInput('prefix', config.prefix);
    selectComponent.setInput('suffix', config.suffix);
    return selectComponent;
  }

  private createSelectSearchComponent(
    viewContainer: ViewContainerRef,
    config: FlDynamicFieldConfigSelectSearch
  ): ComponentRef<FlDynamicFieldAbstractDirective> {
    const selectComponent = viewContainer.createComponent(FlDynamicFieldSelectSearchComponent);
    selectComponent.setInput('selectOptions', config.selectOptions);
    return selectComponent;
  }

  private createListComponent(
    viewContainer: ViewContainerRef,
    config: FlDynamicFieldConfigList
  ): ComponentRef<FlDynamicFieldAbstractDirective> {
    const listComponent = viewContainer.createComponent(FlDynamicFieldListComponent);
    listComponent.setInput('prefix', config.prefix);
    listComponent.setInput('suffix', config.suffix);
    return listComponent;
  }

  private createBooleanComponent(
    viewContainer: ViewContainerRef
  ): ComponentRef<FlDynamicFieldAbstractDirective> {
    return viewContainer.createComponent(FlDynamicFieldBooleanComponent);
  }

  private createTextareaComponent(
    viewContainer: ViewContainerRef
  ): ComponentRef<FlDynamicFieldAbstractDirective> {
    return viewContainer.createComponent(FlDynamicFieldTextareaComponent);
  }

  private createDateComponent(
    viewContainer: ViewContainerRef,
    config: FlDynamicFieldConfigDate
  ): ComponentRef<FlDynamicFieldAbstractDirective> {
    const component = viewContainer.createComponent(FlDynamicFieldDateComponent);
    component.setInput('includeTime', !!config.includeTime);
    component.setInput('minValue', config.minValue ? DateTime.fromISO(config.minValue) : null);
    component.setInput('maxValue', config.maxValue ? DateTime.fromISO(config.maxValue) : null);
    return component;
  }

  ////////////////////////// GROUP //////////////////////////

  protected getAdditionalGroupConfig(): Record<string, FlDynamicGroupAdditionalConfig> {
    return {};
  }

  protected isAdditionalGroupType(type: string): boolean {
    return this.getAdditionalGroupConfig()[type] != null;
  }

  public generateGroupComponent(
    config: FlDynamicFormAbstractControl,
    control: AbstractControl,
    viewContainer: ViewContainerRef
  ): ComponentRef<FlDynamicAbstractFormDirective> {
    let viewComponentRef: ComponentRef<FlDynamicAbstractFormDirective>;
    // if the type is supported by the module config, use it
    if (this.isAdditionalGroupType(config.controlType)) {
      const additionalConfig = this.getAdditionalGroupConfig()[config.controlType];
      viewComponentRef = additionalConfig(viewContainer, config);
    } else {
      if (config.controlType === 'formControl') {
        viewComponentRef = viewContainer.createComponent(FlDynamicFieldComponent);
      } else if (config.controlType === 'formGroup') {
        viewComponentRef = viewContainer.createComponent(FlDynamicFormGroupComponent);
      } else if (config.controlType === 'formArray') {
        viewComponentRef = viewContainer.createComponent(FlDynamicFormArrayComponent);
      } else {
        throw new Error('Unknown groupe type: ' + config.controlType);
      }
    }

    viewComponentRef.setInput('config', config);
    viewComponentRef.setInput('control', control);
    return viewComponentRef;
  }
}
