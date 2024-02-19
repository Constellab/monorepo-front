import {LabEntity} from '../global/lab-entity.entity';
import {
  FlEntity,
  FlEntityPaginatedDatasource,
  FlStatus,
  FlStatusDict,
  FlStatusHelper,
  FlStatusTransform
} from '@monorepo/front-core-lib';
import {Expose, Type} from 'class-transformer';
import {LabBaseEntityWithUser, LabUser} from './lab-user.entity';
import {ClLuxonDateTimeTransform} from '@monorepo/core-lib';
import {DateTime} from 'luxon';
import {LabProject, LabProjectObject} from './lab-project.class';
import {LabRunningProcessInfo} from './process/lab-process.entity';
import {TeRichTextContent} from '@monorepo/text-editor';

export type LabExperimentStatus = 'DRAFT' | 'IN_QUEUE' | 'WAITING_FOR_CLI_PROCESS'
  | 'RUNNING' | 'SUCCESS' | 'ERROR' | 'PARTIALLY_RUN';
export type LabExperimentPidStatus = 'NONE' | 'RUNNING' | 'UNEXPECTED_STOPPED';

// const to list the experiment status translation texts
export const labExperimentStatusDict: FlStatusDict<LabExperimentStatus> = {
  DRAFT: FlStatusHelper.getDraftStatus('DRAFT'),
  IN_QUEUE: FlStatusHelper.getInfoStatus('IN_QUEUE', 'biox.experiment_in_queue', FlStatusHelper.draftIcon),
  SUCCESS: FlStatusHelper.getSuccessStatus('SUCCESS'),
  ERROR: FlStatusHelper.getErrorStatus('ERROR'),
  RUNNING: FlStatusHelper.getRunningStatus('RUNNING'),
  WAITING_FOR_CLI_PROCESS: FlStatusHelper.getInfoStatus('WAITING_FOR_CLI_PROCESS', 'biox.experiment_waiting_for_cli',
    FlStatusHelper.runningIcon),
  PARTIALLY_RUN: FlStatusHelper.getInfoStatus('PARTIALLY_RUN', 'pr.partially_run',
    FlStatusHelper.draftIcon)
};

export type LabExperimentCreationType =
  'MANUAL'
  | 'AUTO';

export class LabExperiment extends LabBaseEntityWithUser implements LabProjectObject {

  title: string;

  description: TeRichTextContent;

  data: void;

  @Expose({name: 'creation_type'})
  creationType: LabExperimentCreationType;

  @Type(() => LabEntity)
  protocol: LabEntity;

  @FlStatusTransform(labExperimentStatusDict)
  status: FlStatus<LabExperimentStatus>;

  @Expose({name: 'is_validated'})
  isValidated: boolean;

  @Expose({name: 'validated_by'})
  @Type(() => LabUser)
  validatedBy?: LabUser;

  @Expose({name: 'validated_at'})
  @ClLuxonDateTimeTransform()
  validatedAt?: DateTime;

  @Expose({name: 'last_sync_at'})
  @ClLuxonDateTimeTransform()
  lastSyncAt?: DateTime;

  @Expose({name: 'last_sync_by'})
  @Type(() => LabUser)
  lastSyncBy?: LabUser;

  get isSynced(): boolean {
    return this.lastSyncAt != null;
  }

  @Type(() => LabProject)
  project: LabProject;

  @Expose({name: 'pid_status'})
  pidStatus: LabExperimentPidStatus;

  // return true if basic info can be edited (like title, description...)
  isInfoEditable(): boolean {
    return !this.isArchived && !this.isValidated;
  }

  // return true if the experiment can be edited (like protocol, validation)
  isEditable(): boolean {
    return this.isInfoEditable() && !this.isRunning() && this.status.value !== 'IN_QUEUE';
  }

  isRunning(): boolean {
    return this.status.value === 'RUNNING' || this.status.value === 'WAITING_FOR_CLI_PROCESS';
  }

  isFinished(): boolean {
    return this.status.value === 'SUCCESS' || this.status.value === 'ERROR';
  }

  isDraft(): boolean {
    return this.status.value === 'DRAFT';
  }

  isWaiting(): boolean {
    return this.status.value === 'IN_QUEUE';
  }

  isAuto(): boolean {
    return this.creationType === 'AUTO';
  }

  toString(): string {
    return this.title;
  }
}

export type LabExperimentDatasource = FlEntityPaginatedDatasource<LabExperiment>;

// form object to create an experiment
export interface LabExperimentSimpleForm {
  title: string;
  project: LabEntity;
  protocolTemplate?: FlEntity;
  protocolTemplateJsonFile?: File;
}

export class LabRunningExperimentInfo extends LabEntity {

  title: string;

  @Expose({name: 'running_tasks'})
  @Type(() => LabRunningProcessInfo)
  runningTasks: LabRunningProcessInfo;

  project: {
    id: string;
    title: string;
  };
}

