import {FlStatus, FlStatusDict, FlStatusHelper} from '@monorepo/front-core-lib';
import {PrIO} from './pr-io.class';
import {PrConfig} from './pr-config.class';
import {TdTypeObjectStatus} from '@monorepo/technical-doc';

export type PrProcessStatus = 'DRAFT' | 'RUNNING' | 'SUCCESS' | 'ERROR' | 'PARTIALLY_RUN';


export const prProcessStatusDict: FlStatusDict<PrProcessStatus> = {
  DRAFT: FlStatusHelper.getDraftStatus('DRAFT'),
  RUNNING: FlStatusHelper.getRunningStatus('RUNNING'),
  SUCCESS: FlStatusHelper.getSuccessStatus('SUCCESS'),
  ERROR: FlStatusHelper.getErrorStatus('ERROR'),
  PARTIALLY_RUN: FlStatusHelper.getInfoStatus('PARTIALLY_RUN', 'pr.partially_run',
    FlStatusHelper.draftIcon)
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

  inputs: Record<string, PrIO>;

  outputs: Record<string, PrIO>;

  parentProtocolId: string;

  typeStatus?: TdTypeObjectStatus;
}
