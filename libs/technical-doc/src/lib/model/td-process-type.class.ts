import {TdTypeEntity} from './td-type.class';
import {TdParamSpec} from './td-config-spec.class';

export interface TdIOSpecs{
  specs: Record<string, TdIOSpec>;

  is_dynamic: boolean;
}

export interface TdProcessType extends TdTypeEntity {
  inputSpecs: TdIOSpecs;

  outputSpecs: TdIOSpecs;

  configSpecs: Record<string, TdParamSpec>;

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

export interface TdResourceTypeDTO {
  typing_name: string;

  human_name: string;

  short_description: string;

  brick_version: string;
}
