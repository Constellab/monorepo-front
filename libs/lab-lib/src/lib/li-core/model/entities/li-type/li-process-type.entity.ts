import {
  TdIOSpec,
  TdIOSpecs,
  TdParamSpecs,
  TdProcessAdditionalInfoDTO,
  TdProcessType,
} from '@monorepo/technical-doc';
import { Expose } from 'class-transformer';

import { LiTypeEntity } from './li-type.entity';

export class LiProcessType extends LiTypeEntity {
  @Expose({ name: 'input_specs' })
  inputSpecs: TdIOSpecs;

  @Expose({ name: 'output_specs' })
  outputSpecs: TdIOSpecs;

  @Expose({ name: 'config_specs' })
  configSpecs: TdParamSpecs;

  @Expose({ name: 'additional_info' })
  additionalInfo: TdProcessAdditionalInfoDTO | undefined;

  hasConfigSpecs(): boolean {
    return Object.keys(this.configSpecs).length > 0;
  }

  getSourceInputSpec(): TdIOSpec | null {
    return this.inputSpecs.specs['source'] ?? null;
  }

  getTargetOutputSpec(): TdIOSpec | null {
    return this.outputSpecs.specs['target'] ?? null;
  }

  toTypeEntity(): TdProcessType {
    return {
      ...super.toTypeEntity(),
      inputSpecs: this.inputSpecs,
      outputSpecs: this.outputSpecs,
      configSpecs: this.configSpecs,
      additionalInfo: this.additionalInfo,
    };
  }
}
