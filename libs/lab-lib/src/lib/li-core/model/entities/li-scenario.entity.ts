import { ClLuxonDateTimeTransform } from '@monorepo/core-lib';
import { DateTime } from 'luxon';
import { Expose, Type } from 'class-transformer';
import { FlEntity, FlEntityPaginatedDatasource } from '@monorepo/front-core-lib/fl-core';
import {
  FlStatus,
  FlStatusDict,
  FlStatusHelper,
  FlStatusTransform,
} from '@monorepo/front-core-lib/fl-status';
import { LiBaseEntityWithUser, LiUser } from './li-user.entity';
import { LiEntity } from '../global/li-entity.entity';
import { LiFolder, LiFolderObject } from './li-folder.class';
import { LiRunningProcessInfo } from './process/li-process.entity';
import { TeRichText, TeRichTextTransform } from '@monorepo/text-editor';

export type LiScenarioStatus =
  | 'DRAFT'
  | 'IN_QUEUE'
  | 'WAITING_FOR_CLI_PROCESS'
  | 'RUNNING'
  | 'SUCCESS'
  | 'ERROR'
  | 'PARTIALLY_RUN';
export type LiScenarioPidStatus = 'NONE' | 'RUNNING' | 'UNEXPECTED_STOPPED';

// const to list the scenario status translation texts
export const labScenarioStatusDict: FlStatusDict<LiScenarioStatus> = {
  DRAFT: FlStatusHelper.getDraftStatus('DRAFT', 'draft'),
  IN_QUEUE: FlStatusHelper.getInfoStatus('IN_QUEUE', 'biox.scenario_in_queue', FlStatusHelper.draftIcon),
  SUCCESS: FlStatusHelper.getSuccessStatus('SUCCESS', 'success'),
  ERROR: FlStatusHelper.getErrorStatus('ERROR', 'error'),
  RUNNING: FlStatusHelper.getLoadingStatus('RUNNING', 'running'),
  WAITING_FOR_CLI_PROCESS: FlStatusHelper.getLoadingStatus(
    'WAITING_FOR_CLI_PROCESS',
    'biox.scenario_waiting_for_cli'
  ),
  PARTIALLY_RUN: FlStatusHelper.getInfoStatus('PARTIALLY_RUN', 'pr.partially_run', FlStatusHelper.draftIcon),
};

export type LiScenarioCreationType = 'MANUAL' | 'AUTO' | 'IMPORTED';
export const flScenarioCreationTypes: FlStatusDict<LiScenarioCreationType> = {
  MANUAL: FlStatusHelper.getInfoStatus(
    'MANUAL',
    'biox.scenario_creation_type_MANUAL',
    'fiber_manual_record',
    'biox.scenario_creation_type_help_MANUAL'
  ),
  AUTO: FlStatusHelper.getInfoStatus(
    'AUTO',
    'biox.scenario_creation_type_AUTO',
    'smart_toy',
    'biox.scenario_creation_type_help_AUTO'
  ),
  IMPORTED: FlStatusHelper.getInfoStatus(
    'IMPORTED',
    'biox.scenario_creation_type_IMPORTED',
    'cloud_download',
    'biox.scenario_creation_type_help_IMPORTED'
  ),
};

export class LiScenario extends LiBaseEntityWithUser implements LiFolderObject {
  title: string;

  @TeRichTextTransform()
  description: TeRichText;

  data: void;

  @Expose({ name: 'creation_type' })
  creationType: LiScenarioCreationType;

  @Type(() => LiEntity)
  protocol: LiEntity;

  @FlStatusTransform(labScenarioStatusDict)
  status: FlStatus<LiScenarioStatus>;

  @Expose({ name: 'is_validated' })
  isValidated: boolean;

  @Expose({ name: 'validated_by' })
  @Type(() => LiUser)
  validatedBy?: LiUser;

  @Expose({ name: 'validated_at' })
  @ClLuxonDateTimeTransform()
  validatedAt?: DateTime;

  @Expose({ name: 'last_sync_at' })
  @ClLuxonDateTimeTransform()
  lastSyncAt?: DateTime;

  @Expose({ name: 'last_sync_by' })
  @Type(() => LiUser)
  lastSyncBy?: LiUser;

  get isSynced(): boolean {
    return this.lastSyncAt != null;
  }

  @Type(() => LiFolder)
  folder: LiFolder;

  @Expose({ name: 'pid_status' })
  pidStatus: LiScenarioPidStatus;

  // return true if basic info can be edited (like title, description...)
  isInfoEditable(): boolean {
    return !this.isArchived && !this.isValidated;
  }

  // return true if the protocol of the scenario can be edited
  protocolIsEditable(): boolean {
    return this.isInfoEditable() && !this.isRunningOrWaiting();
  }

  isRunning(): boolean {
    return this.status.value === 'RUNNING' || this.status.value === 'WAITING_FOR_CLI_PROCESS';
  }

  isRunningOrWaiting(): boolean {
    return this.isRunning() || this.isWaiting();
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

  get isSpecialCreationType(): boolean {
    return this.creationType === 'AUTO' || this.creationType === 'IMPORTED';
  }

  get specialTypeInfo(): FlStatus<LiScenarioCreationType> {
    return flScenarioCreationTypes[this.creationType];
  }

  toString(): string {
    return this.title;
  }
}

export type LiScenarioDatasource<F = void> = FlEntityPaginatedDatasource<LiScenario, F>;

// form object to create a scenario
export interface LiScenarioSimpleForm {
  title: string;
  folder: LiEntity;
  scenarioTemplate?: FlEntity;
  scenarioTemplateJsonFile?: File;
}

export class LiRunningScenarioInfo extends LiEntity {
  title: string;

  @Expose({ name: 'running_tasks' })
  @Type(() => LiRunningProcessInfo)
  runningTasks: LiRunningProcessInfo;

  folder: {
    id: string;
    title: string;
  };
}
