import { Component, computed, input, Signal } from '@angular/core';
import {
  FlDynamicEditableFormGroupConfig,
  FlDynamicFormGroupConfig,
  FlDynamicFormHelper,
} from '@monorepo/front-core-lib';
import { LabConfig } from '../../../../model/entities/lab-config.entity';
import { FormBuilder, FormGroup, UntypedFormGroup } from '@angular/forms';
import { PrConfig, PrConfigValues } from '@monorepo/protocol';

export interface LabConfigureSpecsForm {
  public: UntypedFormGroup;
  protected: UntypedFormGroup;
}

/**
 * Use to create a form to configure a process
 * The FlDynamicFieldConfigService must be provided to support custom fields
 */
@Component({
  selector: 'lab-configure-specs-form',
  templateUrl: './lab-configure-specs-form.component.html',
  styleUrls: ['./lab-configure-specs-form.component.scss'],
})
export class LabConfigureSpecsFormComponent {
  configData = input.required<LabConfig>();

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
  public static buildFormGroup(configData: PrConfig): FormGroup<LabConfigureSpecsForm> {
    const labConfig = LabConfig.fromSpecs(configData.specs, configData.values);
    const value = labConfig.mergeConfigWithDefault();
    return new FormBuilder().group({
      public: FlDynamicFormHelper.generateFormGroup(labConfig.getDynamicFormFieldsConfig('public'), value),
      protected: FlDynamicFormHelper.generateFormGroup(
        labConfig.getDynamicFormFieldsConfig('protected'),
        value
      ),
    });
  }

  public static buildValues(formGp: FormGroup<LabConfigureSpecsForm>): PrConfigValues {
    return { ...formGp.getRawValue().public, ...formGp.getRawValue().protected };
  }
}
