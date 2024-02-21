import {FlStatus, FlStatusDict, FlStatusHelper} from '@monorepo/front-core-lib';
import {PrOI} from './pr-io.class';
import {PrConfig} from './pr-config.class';
import {TdTypeObjectStatus} from '@monorepo/technical-doc';

export type PrProcessStatus = 'DRAFT' | 'RUNNING' | 'SUCCESS' | 'ERROR' | 'PARTIALLY_RUN' | 'WAITING_FOR_CLI_PROCESS';


export const prProcessStatusDict: FlStatusDict<PrProcessStatus> = {
  DRAFT: FlStatusHelper.getDraftStatus('DRAFT'),
  RUNNING: FlStatusHelper.getLoadingStatus('RUNNING', 'flStatus.running'),
  SUCCESS: FlStatusHelper.getSuccessStatus('SUCCESS'),
  ERROR: FlStatusHelper.getErrorStatus('ERROR'),
  PARTIALLY_RUN: FlStatusHelper.getInfoStatus('PARTIALLY_RUN', 'pr.partially_run',
    FlStatusHelper.draftIcon),
  WAITING_FOR_CLI_PROCESS: FlStatusHelper.getLoadingStatus('WAITING_FOR_CLI_PROCESS', 'pr.waiting_for_cli_process'),
};

/**
 * Task or protocol inside a flow
 */
export interface PrProcess {

  id: string;

  instanceName: string;

  processTypingName: string;

  name: string;

  status: FlStatus<PrProcessStatus>;

  config: PrConfig;

  inputs: PrOI;

  outputs: PrOI;

  parentProtocolId: string;

  typeStatus?: TdTypeObjectStatus;
}
