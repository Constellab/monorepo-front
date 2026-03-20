import { ClLuxonDateTimeTransform } from '@monorepo/core-lib';
import { FlEntity, FlEntityPaginatedDatasource } from '@monorepo/front-core-lib/fl-core';
import { FlStatus, FlStatusDict, FlStatusHelper } from '@monorepo/front-core-lib/fl-status';
import { TeRichText, TeRichTextTransform } from '@monorepo/text-editor';
import { Expose, Type } from 'class-transformer';
import { DateTime } from 'luxon';

import { LiEntity } from '../global/li-entity.entity';
import { LiFolder, LiFolderObject } from './li-folder.class';
import { LiBaseEntityWithUser, LiUser } from './li-user.entity';
import { LiRunningProcessInfo } from './process/li-process.entity';

export type LiScenarioStatus =
  | 'DRAFT'
  | 'IN_QUEUE'
  | 'WAITING_FOR_CLI_PROCESS'
  | 'RUNNING'
  | 'SUCCESS'
  | 'ERROR'
  | 'PARTIALLY_RUN';

export type LiScenarioDisplayStatus =
  | LiScenarioStatus
  | 'RUNNING_IN_EXTERNAL_LAB'
  | 'IN_QUEUE_IN_EXTERNAL_LAB'
  | 'WAITING_FOR_CLI_PROCESS_IN_EXTERNAL_LAB';

export type LiScenarioPidStatus = 'NONE' | 'RUNNING' | 'UNEXPECTED_STOPPED';

// const to list the scenario status translation texts
export const LI_SCENARIO_STATUS_DICT: FlStatusDict<LiScenarioStatus> = {
  DRAFT: FlStatusHelper.getDraftStatus('DRAFT', 'li.draft'),
  IN_QUEUE: FlStatusHelper.getInfoStatus('IN_QUEUE', 'li.scenario_in_queue', FlStatusHelper.draftIcon),
  SUCCESS: FlStatusHelper.getSuccessStatus('SUCCESS', 'li.success'),
  ERROR: FlStatusHelper.getErrorStatus('ERROR', 'li.error'),
  RUNNING: FlStatusHelper.getLoadingStatus('RUNNING', 'li.running'),
  WAITING_FOR_CLI_PROCESS: FlStatusHelper.getLoadingStatus(
    'WAITING_FOR_CLI_PROCESS',
    'li.scenario_waiting_for_cli'
  ),
  PARTIALLY_RUN: FlStatusHelper.getInfoStatus('PARTIALLY_RUN', 'li.partially_run', FlStatusHelper.draftIcon),
};

// display-only statuses for external lab scenarios
const LI_SCENARIO_EXTERNAL_STATUS_MAP: Partial<Record<LiScenarioStatus, FlStatus<LiScenarioDisplayStatus>>> =
  {
    RUNNING: FlStatusHelper.getLoadingStatus('RUNNING_IN_EXTERNAL_LAB', 'li.running_in_external_lab'),
    IN_QUEUE: FlStatusHelper.getLoadingStatus('IN_QUEUE_IN_EXTERNAL_LAB', 'li.scenario_in_queue_external'),
    WAITING_FOR_CLI_PROCESS: FlStatusHelper.getLoadingStatus(
      'WAITING_FOR_CLI_PROCESS_IN_EXTERNAL_LAB',
      'li.scenario_waiting_for_cli_external'
    ),
  };

export type LiScenarioCreationType = 'MANUAL' | 'AUTO' | 'IMPORTED';
export const LI_SCENARIO_CREATION_TYPES: FlStatusDict<LiScenarioCreationType> = {
  MANUAL: FlStatusHelper.getInfoStatus(
    'MANUAL',
    'li.scenario_creation_type_MANUAL',
    'fiber_manual_record',
    'li.scenario_creation_type_help_MANUAL'
  ),
  AUTO: FlStatusHelper.getInfoStatus(
    'AUTO',
    'li.scenario_creation_type_AUTO',
    'smart_toy',
    'li.scenario_creation_type_help_AUTO'
  ),
  IMPORTED: FlStatusHelper.getInfoStatus(
    'IMPORTED',
    'li.scenario_creation_type_IMPORTED',
    'cloud_download',
    'li.scenario_creation_type_help_IMPORTED'
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

  status: LiScenarioStatus;

  @Expose({ name: 'is_running_in_external_lab' })
  isRunningInExternalLab: boolean;

  get statusInfo(): FlStatus<LiScenarioDisplayStatus> {
    if (this.isRunningInExternalLab) {
      const externalStatus = LI_SCENARIO_EXTERNAL_STATUS_MAP[this.status];
      if (externalStatus) return externalStatus;
    }
    return LI_SCENARIO_STATUS_DICT[this.status];
  }

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

  @Expose({ name: 'last_run_by' })
  @Type(() => LiUser)
  lastRunBy?: LiUser;

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

  isResettable(): boolean {
    return this.isRunningOrWaiting() || this.isFinished();
  }

  isRunning(): boolean {
    return this.status === 'RUNNING' || this.status === 'WAITING_FOR_CLI_PROCESS';
  }

  isRunningOrWaiting(): boolean {
    return this.isRunning() || this.isWaiting();
  }

  isFinished(): boolean {
    return this.status === 'SUCCESS' || this.status === 'ERROR';
  }

  isDraft(): boolean {
    return this.status === 'DRAFT';
  }

  isWaiting(): boolean {
    return this.status === 'IN_QUEUE';
  }

  get isSpecialCreationType(): boolean {
    return this.creationType === 'AUTO' || this.creationType === 'IMPORTED';
  }

  get specialTypeInfo(): FlStatus<LiScenarioCreationType> {
    return LI_SCENARIO_CREATION_TYPES[this.creationType];
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
