import {LabTypeEntity} from './lab-type.entity';
import {Expose} from 'class-transformer';
import {TdIOSpecs, TdParamSpecs, TdProcessAdditionalInfoDTO, TdProcessType} from '@monorepo/technical-doc';

export class LabProcessType extends LabTypeEntity implements TdProcessType {

  @Expose({name: 'input_specs'})
  inputSpecs: TdIOSpecs;

  @Expose({name: 'output_specs'})
  outputSpecs: TdIOSpecs;

  @Expose({name: 'config_specs'})
  configSpecs: TdParamSpecs;

  @Expose({name: 'additional_info'})
  additionalInfo: TdProcessAdditionalInfoDTO | undefined;

  hasConfigSpecs(): boolean {
    return Object.keys(this.configSpecs).length > 0;
  }


}
