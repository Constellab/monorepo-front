import { FlStatus, FlStatusDict, FlStatusHelper } from '@monorepo/front-core-lib/fl-status';
import { TdConfigI, TdSimpleTypeEntity, TdTypeObjectStatus, TdTypeStyle } from '@monorepo/technical-doc';

import { PrOI } from './pr-io.class';

export type PrProcessStatus =
  | 'DRAFT'
  | 'RUNNING'
  | 'SUCCESS'
  | 'ERROR'
  | 'PARTIALLY_RUN'
  | 'WAITING_FOR_CLI_PROCESS';

export class PrProcessStatusHelper {
  public static isFinished(status: PrProcessStatus): boolean {
    return status === 'SUCCESS' || status === 'ERROR';
  }

  public static wasRun(status: PrProcessStatus): boolean {
    return this.isFinished(status) || status === 'PARTIALLY_RUN';
  }
}

export const prProcessStatusDict: FlStatusDict<PrProcessStatus> = {
  DRAFT: FlStatusHelper.getDraftStatus('DRAFT', 'pr.draft'),
  RUNNING: FlStatusHelper.getLoadingStatus('RUNNING', 'pr.running'),
  SUCCESS: FlStatusHelper.getSuccessStatus('SUCCESS', 'pr.success'),
  ERROR: FlStatusHelper.getErrorStatus('ERROR', 'pr.error'),
  PARTIALLY_RUN: FlStatusHelper.getInfoStatus('PARTIALLY_RUN', 'pr.partially_run', FlStatusHelper.draftIcon),
  WAITING_FOR_CLI_PROCESS: FlStatusHelper.getLoadingStatus(
    'WAITING_FOR_CLI_PROCESS',
    'pr.waiting_for_cli_process'
  ),
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

  config: TdConfigI;

  inputs: PrOI;

  outputs: PrOI;

  parentProtocolId: string;

  typeStatus: TdTypeObjectStatus | null;

  processType: TdSimpleTypeEntity | null;

  isProtocol: boolean;

  style: TdTypeStyle;
}
