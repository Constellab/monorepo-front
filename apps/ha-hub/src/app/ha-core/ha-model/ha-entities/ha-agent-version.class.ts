import { HaAgent } from './ha-agent.class';
import { FlEntity } from '@monorepo/front-core-lib';
import { DateTime } from 'luxon';
import { TdIOSpecs, TdParamSpecs, TdParamSpecsValues, TdTypeStyle } from '@monorepo/technical-doc';
import { TeRichText, TeRichTextTransform } from '@monorepo/text-editor';

export enum HaAgentVersionState {
  PUBLISHED = 'PUBLISHED',
  DRAFT = 'DRAFT',
}

export enum HaAgentVersionType {
  PYTHON = 'PYTHON',
  CONDA_PYTHON = 'CONDA_PYTHON',
  MAMBA_PYTHON = 'MAMBA_PYTHON',
  PIP_PYTHON = 'PIP_PYTHON',
  CONDA_R = 'CONDA_R',
  MAMBA_R = 'MAMBA_R',
  STREAMLIT = 'STREAMLIT',
}

export class HaAgentVersion implements FlEntity {
  id: string;
  version: number;
  agent: HaAgent;
  versionState: HaAgentVersionState;

  @TeRichTextTransform()
  versionInfos?: TeRichText;
  environment: string;
  type: HaAgentVersionType;
  params: TdParamSpecsValues;
  code: string;
  createdAt: DateTime;
  inputSpecs?: TdIOSpecs;
  outputSpecs?: TdIOSpecs;
  configSpecs?: TdParamSpecs;
  style?: TdTypeStyle;
}

export class HaAgentVersionFileInputBrick {
  name: string;
  version: string;
}

export class HaAgentVersionFileInput {
  json_version: number;
  code: string;
  params: string | string[] | TdParamSpecsValues;
  environment: string;
  input_specs: TdIOSpecs;
  output_specs: TdIOSpecs;
  config_specs: Record<string, any>;
  bricks: HaAgentVersionFileInputBrick[];
  task_type: HaAgentVersionType;
  style?: TdTypeStyle;

  static isValid(obj: any): boolean {
    //check vars exist and vars type
    return (
      obj &&
      typeof obj.json_version === 'number' &&
      typeof obj.code === 'string' &&
      typeof obj.environment === 'string' &&
      typeof obj.input_specs === 'object' &&
      typeof obj.output_specs === 'object' &&
      typeof obj.config_specs === 'object' &&
      typeof obj.bricks === 'object' &&
      typeof obj.task_type === 'string'
    );
  }
}
