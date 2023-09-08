import {CaBaseEntity} from '../ca-base-entity.class';
import {CaLabInstance} from '../lab/ca-lab-instance.class';
import {FlQuillJson, FlStatus, FlStatusDict, FlStatusHelper, FlStatusTransform} from '@monorepo/front-core-lib';
import {Type} from 'class-transformer';
import {ClLuxonDateTimeTransform} from '@monorepo/core-lib';
import {DateTime} from 'luxon';
import {CaUser} from '../ca-user.class';
import {CaProject, CaProjectObject} from './ca-project.class';

export type CaExperimentStatus = 'DRAFT' | 'SUCCESS' | 'ERROR' | 'ARCHIVED' | 'PARTIALLY_RUN';

export const caExperimentStatusDict: FlStatusDict<CaExperimentStatus> = {
  DRAFT: FlStatusHelper.getDraftStatus('DRAFT'),
  ARCHIVED: FlStatusHelper.getInfoStatus('ARCHIVED'),
  SUCCESS: FlStatusHelper.getSuccessStatus('SUCCESS'),
  ERROR: FlStatusHelper.getErrorStatus('ERROR'),
  PARTIALLY_RUN: FlStatusHelper.getInfoStatus('PARTIALLY_RUN', 'pr.partially_run',
    FlStatusHelper.draftIcon)
};

export class CaExperiment extends CaBaseEntity implements CaProjectObject {

  title: string;

  description: FlQuillJson;

  @Type(() => CaLabInstance)
  labInstance: CaLabInstance;

  @FlStatusTransform(caExperimentStatusDict)
  status: FlStatus<CaExperimentStatus>;

  projectId: string;

  project?: CaProject;

  isValidated: boolean;

  @Type(() => CaUser)
  validatedBy?: CaUser;

  @ClLuxonDateTimeTransform()
  validatedAt?: DateTime;

  @ClLuxonDateTimeTransform()
  lastSyncAt?: DateTime;

  @Type(() => CaUser)
  lastSyncBy?: CaUser;
}

