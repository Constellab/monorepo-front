import { CaBaseEntity } from '../ca-base-entity.class';
import { CaLab } from '../lab/ca-lab.class';
import { FlStatus, FlStatusDict, FlStatusHelper, FlStatusTransform } from '@monorepo/front-core-lib';
import { Type } from 'class-transformer';
import { ClLuxonDateTimeTransform } from '@monorepo/core-lib';
import { DateTime } from 'luxon';
import { CaUser } from '../ca-user.class';
import { CaFolderObject } from './ca-folder.class';
import { TeRichTextContent } from '@monorepo/text-editor';

export type CaScenarioStatus = 'DRAFT' | 'SUCCESS' | 'ERROR' | 'ARCHIVED' | 'PARTIALLY_RUN';

export const caScenarioStatusDict: FlStatusDict<CaScenarioStatus> = {
  DRAFT: FlStatusHelper.getDraftStatus('DRAFT'),
  ARCHIVED: FlStatusHelper.getInfoStatus('ARCHIVED'),
  SUCCESS: FlStatusHelper.getSuccessStatus('SUCCESS'),
  ERROR: FlStatusHelper.getErrorStatus('ERROR'),
  PARTIALLY_RUN: FlStatusHelper.getInfoStatus('PARTIALLY_RUN', 'pr.partially_run',
    FlStatusHelper.draftIcon)
};

export class CaScenario extends CaBaseEntity implements CaFolderObject {

  title: string;

  description: TeRichTextContent;

  @Type(() => CaLab)
  lab: CaLab;

  @FlStatusTransform(caScenarioStatusDict)
  status: FlStatus<CaScenarioStatus>;

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

