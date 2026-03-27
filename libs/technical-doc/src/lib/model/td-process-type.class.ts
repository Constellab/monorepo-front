import { TdParamSpecs } from './td-config-spec.class';
import { TdTypeRefDTO, TdTypeTypingEntity } from './td-type.class';

export interface TdIOSpecs {
  specs: Record<string, TdIOSpec>;

  is_dynamic: boolean;
}

export interface TdProcessType extends TdTypeTypingEntity {
  inputSpecs: TdIOSpecs;

  outputSpecs: TdIOSpecs;

  configSpecs: TdParamSpecs;

  additionalInfo: TdProcessAdditionalInfoDTO | undefined;
}

export interface TdProcessAdditionalInfoDTO {
  supported_extensions: string[];
}

export interface TdIOSpec {
  resource_types: TdTypeRefDTO[];

  human_name: string;

  short_description: string;

  optional?: boolean;

  sub_class?: boolean;
}
