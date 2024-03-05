import {TdTypeEntity, TdTypeStyle} from './td-type.class';
import {TdParamSpecs} from './td-config-spec.class';

export interface TdIOSpecs{
  specs: Record<string, TdIOSpec>;

  is_dynamic: boolean;
}

export interface TdProcessType extends TdTypeEntity {
  inputSpecs: TdIOSpecs;

  outputSpecs: TdIOSpecs;

  configSpecs: TdParamSpecs;

  additionalInfo: TdProcessAdditionalInfoDTO | undefined;
}

export interface TdProcessAdditionalInfoDTO {
  supported_extensions: string[];
}

export interface TdIOSpec {

  resource_types: TdResourceTypeDTO[];

  human_name: string;

  short_description: string;

  is_optional?: boolean;

  is_constant?: boolean;

  sub_class?: boolean;
}

// TODO compare this types with TdTypeEntity, there are some similarities
export interface TdResourceTypeDTO {
  typing_name: string;

  human_name: string;

  brick_version: string;

  style?: TdTypeStyle;
}
