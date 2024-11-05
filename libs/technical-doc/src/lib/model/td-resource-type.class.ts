import { TdTypeStyle, TdTypeTypingEntity } from './td-type.class';
import { RvResourceViewType } from '@monorepo/resource-view';

export interface TdResourceType extends TdTypeTypingEntity {
  variables: Record<string, any>;
  methods: TdResourceMethodList;
}

export interface TdResourceMethodList {
  funcs: TdTechDocFunction[];
  views: TdResourceView[];
}

export enum TdTechDocFunctionType {
  CLASSMETHOD = 'classmethod',
  STATICMETHOD = 'staticmethod',
}

export interface TdTechDocFunction {
  name: string;
  doc?: string;
  args: TdResourceFunctionArg[];
  return_type?: string;
  method_type?: TdTechDocFunctionType;
}

export interface TdResourceFunctionArg {
  arg_name: string;
  arg_type: string;
  arg_default_value?: string;
}

export interface TdResourceView {
  method_name: string;
  view_type: RvResourceViewType;
  human_name: string;
  short_description: string;
  default_view: boolean;
  has_config_specs: boolean;
  config_specs: Record<string, any>;
  style: TdTypeStyle;
}
