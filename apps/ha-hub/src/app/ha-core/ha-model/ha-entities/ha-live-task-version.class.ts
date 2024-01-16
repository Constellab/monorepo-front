import {HaLiveTask} from './ha-live-task.class';
import {HaEntity} from './ha-entity.class';
import {FlEntity} from '@monorepo/front-core-lib';
import {DateTime} from 'luxon';
import {TdParamSpecs} from '@monorepo/technical-doc';
import {TeRichTextContent} from '@monorepo/text-editor';

export enum HaLiveTaskVersionState {
  PUBLISHED = 'PUBLISHED',
  DRAFT = 'DRAFT'
}

export enum HaLiveTaskVersionType{
  PYTHON = 'PYTHON',
  CONDA_PYTHON = 'CONDA_PYTHON',
  MAMBA_PYTHON = 'MAMBA_PYTHON',
  PIP_PYTHON = 'PIP_PYTHON',
  CONDA_R = 'CONDA_R',
  MAMBA_R = 'MAMBA_R'
}

export class HaLiveTaskVersion implements FlEntity{
  id: string;
  version: number;
  liveTask: HaLiveTask;
  versionState: HaLiveTaskVersionState;
  versionInfos?: TeRichTextContent;
  environment: string;
  type: HaLiveTaskVersionType;
  code: string;
  createdAt: DateTime;
  inputSpecs?: Record<string, any>;
  outputSpecs?: Record<string, any>;
  configSpecs?: TdParamSpecs;
}

export class HaLiveTaskVersionFileInputBrick{
  name: string;
  version: string;
}

export class HaLiveTaskVersionFileInput{
  json_version: number;
  code: string;
  environment: string;
  input_specs: Record<string, any>;
  output_specs: Record<string, any>;
  config_specs: Record<string, any>;
  bricks: HaLiveTaskVersionFileInputBrick[];
  task_type: HaLiveTaskVersionType;

  static isValid(obj: any): boolean {
    //check vars exist and vars type
    return obj && typeof obj.json_version === 'number' && typeof obj.code === 'string' && typeof obj.environment === 'string' && typeof obj.input_specs === 'object' && typeof obj.output_specs === 'object' && typeof obj.config_specs === 'object' && typeof obj.bricks === 'object' && typeof obj.task_type === 'string';
  }
}

