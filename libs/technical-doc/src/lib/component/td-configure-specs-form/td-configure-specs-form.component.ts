import { Component, computed, input, Signal } from '@angular/core';
import { TdConfig, TdConfigI } from '../../model/td-config.class';
import { FormBuilder, FormGroup, UntypedFormGroup } from '@angular/forms';
import {
  FlDynamicEditableFormGroupConfig,
  FlDynamicFormGroupConfig,
  FlDynamicFormHelper,
} from '@monorepo/front-core-lib/fl-dynamic-field';
import { TdParamSpecsValues } from '../../model/td-config-spec.class';

export interface TdConfigureSpecsForm {
  public: UntypedFormGroup;
  protected: UntypedFormGroup;
}

/**
 * Component to generate the form to configure the specs of a process
 */
@Component({
  selector: 'td-configure-specs-form',
  standalone: false,
  templateUrl: './td-configure-specs-form.component.html',
  styleUrl: './td-configure-specs-form.component.scss',
})
export class TdConfigureSpecsFormComponent {
  configData = input.required<TdConfig>();

  formGp = input.required<FormGroup>();

  publicFormGp: Signal<UntypedFormGroup> = computed(() => this.formGp().get('public') as FormGroup);
  protectedFormGp: Signal<UntypedFormGroup> = computed(() => this.formGp().get('protected') as FormGroup);

  publicConfig: Signal<FlDynamicFormGroupConfig | FlDynamicEditableFormGroupConfig> = computed(() =>
    this.configData().getDynamicFormFieldsConfig('public')
  );

  protectedConfig: Signal<FlDynamicFormGroupConfig> = computed(() =>
    this.configData().getDynamicFormFieldsConfig('protected')
  );

  showProtectedConfigs: Signal<boolean> = computed(() => this.configData().hasConfigs('protected'));
  protectedConfigExpand: Signal<boolean> = computed(() => !this.configData().hasConfigs('public'));

  // build the form group to configure specs
  public static buildFormGroup(configData: TdConfigI): FormGroup<TdConfigureSpecsForm> {
    const config = TdConfig.fromSpecs(configData.specs, configData.values);
    const value = config.mergeConfigWithDefault();
    return new FormBuilder().group({
      public: FlDynamicFormHelper.generateFormGroup(config.getDynamicFormFieldsConfig('public'), value),
      protected: FlDynamicFormHelper.generateFormGroup(config.getDynamicFormFieldsConfig('protected'), value),
    });
  }

  public static buildValues(formGp: FormGroup<TdConfigureSpecsForm>): TdParamSpecsValues {
    return { ...formGp.getRawValue().public, ...formGp.getRawValue().protected };
  }
}
