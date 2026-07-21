import { ChangeDetectionStrategy,Component, computed, input, Signal } from '@angular/core';
import { FormBuilder, FormGroup, UntypedFormGroup } from '@angular/forms';
import {
  FlDynamicEditableFormGroupConfig,
  FlDynamicFormAbstractControl,
  FlDynamicFormGroupConfig,
  FlDynamicFormHelper,
  FlFormGroupConfig,
} from '@monorepo/front-core-lib/fl-dynamic-field';

import { TdConfig, TdConfigI } from '../../model/td-config.class';
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
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './td-configure-specs-form.component.scss',
})
export class TdConfigureSpecsFormComponent {
  configData = input.required<TdConfig>();

  formGp = input.required<FormGroup>();

  publicFormGp: Signal<UntypedFormGroup> = computed(() => this.formGp().get('public') as FormGroup);
  protectedFormGp: Signal<UntypedFormGroup> = computed(() => this.formGp().get('protected') as FormGroup);

  publicConfig: Signal<FlDynamicFormGroupConfig | FlDynamicEditableFormGroupConfig> = computed(() => {
    const publicConfig = this.configData().getDynamicFormFieldsConfig('public');
    if (this.configData().specs.params?.additional_info?.edition_mode) {
      const subConfigs: Record<string, FlDynamicFormAbstractControl> = (
        publicConfig.subConfigs.params as FlFormGroupConfig
      ).subConfigs;
      for (const key of Object.keys(subConfigs)) {
        const subConfig = subConfigs[key];
        if (!subConfig.hint?.startsWith(`Key : '${key}'`)) {
          subConfig.hint = `Key : '${key}'` + (subConfig.hint ? ' - ' + subConfig.hint : '');
        }
      }
      (publicConfig.subConfigs.params as FlFormGroupConfig).subConfigs = subConfigs;
    }
    return publicConfig;
  });

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
