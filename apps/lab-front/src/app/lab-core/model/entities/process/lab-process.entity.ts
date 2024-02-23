import {LabConfig} from '../lab-config.entity';
import {Expose, Type} from 'class-transformer';
import {LabProgressBar, LabProgressMessage} from '../lab-progress-bar.entity';
import {FlStatus, FlStatusTransform} from '@monorepo/front-core-lib';
import {LabBaseEntityWithUser} from '../lab-user.entity';
import {TdTypeObjectStatus, TdTypingName} from '@monorepo/technical-doc';
import {PrOI, PrProcess, PrProcessStatus, prProcessStatusDict} from '@monorepo/protocol';
import {DateTime} from 'luxon';
import {ClLuxonDateTimeTransform} from '@monorepo/core-lib';
import {LabEntity} from '../../global/lab-entity.entity';

export type LabProcessClass = 'TASK' | 'PROTOCOL';

export interface LabProcessErrorInfo {
  context: string;
  detail: string;
  instance_id: string;
  unique_code: string;
}


export class LabProcessTypeName {
  @Expose({name: 'human_name'})
  humanName?: string;

  @Expose({name: 'short_description'})
  shortDescription?: string;
}

/**
 * Task or protocol inside a flow
 */
export class LabProcess extends LabBaseEntityWithUser implements PrProcess {

  @Expose({name: 'process_typing_name'})
  processTypingName: string;

  @Expose({name: 'experiment_id'})
  experimentId: string;

  @Expose({name: 'parent_protocol_id'})
  parentProtocolId: string;

  @FlStatusTransform(prProcessStatusDict)
  status: FlStatus<PrProcessStatus>;

  @Type(() => LabConfig)
  config: LabConfig;

  @Expose({name: 'instance_name'})
  instanceName: string;

  inputs: PrOI;

  outputs: PrOI;

  @Expose({name: 'progress_bar'})
  @Type(() => LabProgressBar)
  progressBar: LabProgressBar;

  @Expose({name: 'is_archived'})
  isArchived: boolean;

  @Expose({name: 'is_protocol'})
  isProtocol: boolean;

  @Expose({name: 'brick_version_on_create'})
  brickVersionOnCreate: string;

  @Expose({name: 'brick_version_on_run'})
  brickVersionOnRun: string;

  @Expose({name: 'started_at'})
  @ClLuxonDateTimeTransform()
  startedAt?: DateTime;

  @Expose({name: 'ended_at'})
  @ClLuxonDateTimeTransform()
  endedAt?: DateTime;

  @Expose({name: 'type_status'})
  typeStatus: TdTypeObjectStatus;

  @Expose({name: 'error_info'})
  errorInfo: LabProcessErrorInfo;

  @Expose({name: 'process_type'})
  processType: LabProcessTypeName;

  name: string;

  @Expose({name: 'community_live_task_version_id'})
  communityLiveTaskVersionId?: string;

  hasConfig(): boolean {
    return this.config?.hasConfigs() ?? false;
  }

  // return true if the process is of type Source
  isSource(): boolean {
    return this.processTypingName === TdTypingName.task.source.typingName;
  }

  // return true if the process is of type Output
  isOutput(): boolean {
    return this.processTypingName === TdTypingName.task.output.typingName;
  }

  isViewer(): boolean {
    return this.processTypingName === TdTypingName.task.viewer;
  }

  isFinished(): boolean {
    return this.status.value === 'SUCCESS' || this.status.value === 'ERROR';
  }

  wasRun(): boolean {
    return this.isFinished() || this.status.value === 'PARTIALLY_RUN';
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
}

export class LabRunningProcessInfo extends LabEntity {

  title: string;

  @Expose({name: 'last_message'})
  @Type(() => LabProgressMessage)
  lastMessage: LabProgressMessage;

  progression: number;
}
