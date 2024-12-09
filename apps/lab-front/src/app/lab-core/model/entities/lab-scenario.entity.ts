import { LabEntity } from '../global/lab-entity.entity';
import {
  FlEntity,
  FlEntityPaginatedDatasource,
  FlStatus,
  FlStatusDict,
  FlStatusHelper,
  FlStatusTransform,
} from '@monorepo/front-core-lib';
import { Expose, Type } from 'class-transformer';
import { LabBaseEntityWithUser, LabUser } from './lab-user.entity';
import { ClLuxonDateTimeTransform } from '@monorepo/core-lib';
import { DateTime } from 'luxon';
import { LabFolder, LabFolderObject } from './lab-folder.class';
import { LabRunningProcessInfo } from './process/lab-process.entity';
import { TeRichText, TeRichTextTransform } from '@monorepo/text-editor';

export type LabScenarioStatus =
  | 'DRAFT'
  | 'IN_QUEUE'
  | 'WAITING_FOR_CLI_PROCESS'
  | 'RUNNING'
  | 'SUCCESS'
  | 'ERROR'
  | 'PARTIALLY_RUN';
export type LabScenarioPidStatus = 'NONE' | 'RUNNING' | 'UNEXPECTED_STOPPED';

// const to list the scenario status translation texts
export const labScenarioStatusDict: FlStatusDict<LabScenarioStatus> = {
  DRAFT: FlStatusHelper.getDraftStatus('DRAFT'),
  IN_QUEUE: FlStatusHelper.getInfoStatus('IN_QUEUE', 'biox.scenario_in_queue', FlStatusHelper.draftIcon),
  SUCCESS: FlStatusHelper.getSuccessStatus('SUCCESS'),
  ERROR: FlStatusHelper.getErrorStatus('ERROR'),
  RUNNING: FlStatusHelper.getLoadingStatus('RUNNING', 'flStatus.running'),
  WAITING_FOR_CLI_PROCESS: FlStatusHelper.getLoadingStatus(
    'WAITING_FOR_CLI_PROCESS',
    'biox.scenario_waiting_for_cli'
  ),
  PARTIALLY_RUN: FlStatusHelper.getInfoStatus('PARTIALLY_RUN', 'pr.partially_run', FlStatusHelper.draftIcon),
};

export type LabScenarioCreationType = 'MANUAL' | 'AUTO' | 'IMPORTED';
export const flScenarioCreationTypes: FlStatusDict<LabScenarioCreationType> = {
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

export class LabScenario extends LabBaseEntityWithUser implements LabFolderObject {
  title: string;

  @TeRichTextTransform()
  description: TeRichText;

  data: void;

  @Expose({ name: 'creation_type' })
  creationType: LabScenarioCreationType;

  @Type(() => LabEntity)
  protocol: LabEntity;

  @FlStatusTransform(labScenarioStatusDict)
  status: FlStatus<LabScenarioStatus>;

  @Expose({ name: 'is_validated' })
  isValidated: boolean;

  @Expose({ name: 'validated_by' })
  @Type(() => LabUser)
  validatedBy?: LabUser;

  @Expose({ name: 'validated_at' })
  @ClLuxonDateTimeTransform()
  validatedAt?: DateTime;

  @Expose({ name: 'last_sync_at' })
  @ClLuxonDateTimeTransform()
  lastSyncAt?: DateTime;

  @Expose({ name: 'last_sync_by' })
  @Type(() => LabUser)
  lastSyncBy?: LabUser;

  get isSynced(): boolean {
    return this.lastSyncAt != null;
  }

  @Type(() => LabFolder)
  folder: LabFolder;

  @Expose({ name: 'pid_status' })
  pidStatus: LabScenarioPidStatus;

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

  get specialTypeInfo(): FlStatus<LabScenarioCreationType> {
    return flScenarioCreationTypes[this.creationType];
  }

  toString(): string {
    return this.title;
  }
}

export type LabScenarioDatasource<F = void> = FlEntityPaginatedDatasource<LabScenario, F>;

// form object to create a scenario
export interface LabScenarioSimpleForm {
  title: string;
  folder: LabEntity;
  scenarioTemplate?: FlEntity;
  scenarioTemplateJsonFile?: File;
}

export class LabRunningScenarioInfo extends LabEntity {
  title: string;

  @Expose({ name: 'running_tasks' })
  @Type(() => LabRunningProcessInfo)
  runningTasks: LabRunningProcessInfo;

  folder: {
    id: string;
    title: string;
  };
}
