import {FlStatus, FlStatusDict, FlStatusHelper} from '@monorepo/front-core-lib';
import {PrOI} from './pr-io.class';
import {PrConfig} from './pr-config.class';
import {TdTypeObjectStatus} from '@monorepo/technical-doc';

export type PrProcessStatus = 'DRAFT' | 'RUNNING' | 'SUCCESS' | 'ERROR' | 'PARTIALLY_RUN' | 'WAITING_FOR_CLI_PROCESS';


export const prProcessStatusDict: FlStatusDict<PrProcessStatus> = {
  DRAFT: FlStatusHelper.getDraftStatus('DRAFT'),
  RUNNING: FlStatusHelper.getRunningStatus('RUNNING'),
  SUCCESS: FlStatusHelper.getSuccessStatus('SUCCESS'),
  ERROR: FlStatusHelper.getErrorStatus('ERROR'),
  PARTIALLY_RUN: FlStatusHelper.getInfoStatus('PARTIALLY_RUN', 'pr.partially_run',
    FlStatusHelper.draftIcon),
  WAITING_FOR_CLI_PROCESS: FlStatusHelper.getInfoStatus('WAITING_FOR_CLI_PROCESS', 'pr.waiting_for_cli_process',
    FlStatusHelper.runningIcon),
};

/**
 * Task or protocol inside a flow
 */
export interface PrProcess {

  id: string;

  instanceName: string;

  processTypingName: string;

  title: string;

  status: FlStatus<PrProcessStatus>;

  config: PrConfig;

  inputs: PrOI;

  outputs: PrOI;

  parentProtocolId: string;

  typeStatus?: TdTypeObjectStatus;
}
