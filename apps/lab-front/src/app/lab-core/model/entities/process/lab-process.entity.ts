import { Expose, Type } from 'class-transformer';
import { LabProgressBar, LabProgressMessage } from '../lab-progress-bar.entity';
import { FlStatus, FlStatusTransform } from '@monorepo/front-core-lib';
import { LabBaseEntityWithUser } from '../lab-user.entity';
import { TdSimpleTypeEntity, TdTypeObjectStatus, TdTypeStyle, TdTypingName } from '@monorepo/technical-doc';
import {
  PrConfig,
  PrOI,
  PrProcess,
  PrProcessStatus,
  prProcessStatusDict,
  PrProcessStatusHelper,
} from '@monorepo/protocol';
import { DateTime } from 'luxon';
import { ClLuxonDateTimeTransform } from '@monorepo/core-lib';
import { LabEntity } from '../../global/lab-entity.entity';

export type LabProcessClass = 'TASK' | 'PROTOCOL';

export interface LabProcessErrorInfo {
  context: string;
  detail: string;
  instance_id: string;
  unique_code: string;
}

/**
 * Task or protocol inside a flow
 */
export class LabProcess extends LabBaseEntityWithUser {
  @Expose({ name: 'process_typing_name' })
  processTypingName: string;

  @Expose({ name: 'scenario_id' })
  scenarioId: string;

  @Expose({ name: 'parent_protocol_id' })
  parentProtocolId: string;

  @FlStatusTransform(prProcessStatusDict)
  status: FlStatus<PrProcessStatus>;

  config: PrConfig;

  @Expose({ name: 'instance_name' })
  instanceName: string;

  inputs: PrOI;

  outputs: PrOI;

  @Expose({ name: 'progress_bar' })
  @Type(() => LabProgressBar)
  progressBar: LabProgressBar;

  @Expose({ name: 'is_archived' })
  isArchived: boolean;

  @Expose({ name: 'is_protocol' })
  isProtocol: boolean;

  @Expose({ name: 'brick_version_on_create' })
  brickVersionOnCreate: string;

  @Expose({ name: 'brick_version_on_run' })
  brickVersionOnRun: string;

  @Expose({ name: 'started_at' })
  @ClLuxonDateTimeTransform()
  startedAt?: DateTime;

  @Expose({ name: 'ended_at' })
  @ClLuxonDateTimeTransform()
  endedAt?: DateTime;

  @Expose({ name: 'type_status' })
  typeStatus: TdTypeObjectStatus;

  @Expose({ name: 'error_info' })
  errorInfo: LabProcessErrorInfo;

  @Expose({ name: 'process_type' })
  processType: TdSimpleTypeEntity;

  name: string;

  @Expose({ name: 'community_agent_version_id' })
  communityAgentVersionId?: string;

  style: TdTypeStyle;

  @Expose({ name: 'is_agent' })
  isAgent: boolean;

  // return true if the process is of type Source
  isInput(): boolean {
    return this.processTypingName === TdTypingName.task.input.typingName;
  }

  // return true if the process is of type Output
  isOutput(): boolean {
    return this.processTypingName === TdTypingName.task.output.typingName;
  }

  isViewer(): boolean {
    return this.processTypingName === TdTypingName.task.viewer;
  }

  isFinished(): boolean {
    return PrProcessStatusHelper.isFinished(this.status.value);
  }

  wasRun(): boolean {
    return PrProcessStatusHelper.wasRun(this.status.value);
  }

  isRunning(): boolean {
    return this.status.value === 'RUNNING' || this.status.value === 'WAITING_FOR_CLI_PROCESS';
  }

  isError(): boolean {
    return this.status.value === 'ERROR';
  }

  getProcessType(): LabProcessClass {
    return this.isProtocol ? 'PROTOCOL' : 'TASK';
  }

  toPrProcess(): PrProcess {
    return {
      id: this.id,
      instanceName: this.instanceName,
      processTypingName: this.processTypingName,
      name: this.name,
      status: this.status,
      config: this.config,
      inputs: this.inputs,
      outputs: this.outputs,
      parentProtocolId: this.parentProtocolId,
      typeStatus: this.typeStatus,
      processType: this.processType,
      isProtocol: this.isProtocol,
      style: this.style,
    };
  }
}

export class LabRunningProcessInfo extends LabEntity {
  title: string;

  @Expose({ name: 'last_message' })
  @Type(() => LabProgressMessage)
  lastMessage: LabProgressMessage;

  progression: number;
}
