import { ComponentRef, Injectable, ViewContainerRef } from '@angular/core';
import {
  FlDynamicFieldAbstractDirective,
  FlDynamicFieldAdditionalConfig,
  FlDynamicFieldConfigService,
  FlDynamicFieldConfigUnknown,
} from '@monorepo/front-core-lib/fl-dynamic-field';

@Injectable()
export class LiFormDynamicFieldConfig extends FlDynamicFieldConfigService {
  protected getAdditionalFieldConfig(): Record<string, FlDynamicFieldAdditionalConfig> {
    return {
      computed: this.buildComputedField,
    };
  }

  private async buildComputedField(
    viewContainer: ViewContainerRef,
    config: FlDynamicFieldConfigUnknown
  ): Promise<ComponentRef<FlDynamicFieldAbstractDirective>> {
    const type = await import('../component/li-computed-dynamic-field/li-computed-dynamic-field.component');
    const component = viewContainer.createComponent(type.LiComputedDynamicFieldComponent);
    component.instance.expression = config.additionalInfo?.expression ?? '';
    return component;
  }
}
