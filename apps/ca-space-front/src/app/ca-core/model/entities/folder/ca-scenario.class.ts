import { ClLuxonDateTimeTransform } from '@monorepo/core-lib';
import {
  FlStatus,
  FlStatusDict,
  FlStatusHelper,
  FlStatusTransform,
} from '@monorepo/front-core-lib/fl-status';
import { TdTypeStyle } from '@monorepo/technical-doc';
import { TeRichText, TeRichTextTransform } from '@monorepo/text-editor';
import { Type } from 'class-transformer';
import { DateTime } from 'luxon';

import { CaBaseEntity } from '../ca-base-entity.class';
import { CaUser } from '../ca-user.class';
import { CaLab } from '../lab/ca-lab.class';
import { CaFolderObject } from './ca-folder.class';
import { CA_HIERARCHY_OBJECT_TYPE_INFO } from './ca-hierarchy-object.class';

export type CaScenarioStatus = 'DRAFT' | 'SUCCESS' | 'ERROR' | 'ARCHIVED' | 'PARTIALLY_RUN';

const CA_SCENARIO_STATUS_DICT: FlStatusDict<CaScenarioStatus> = {
  DRAFT: FlStatusHelper.getDraftStatus('DRAFT', 'draft'),
  ARCHIVED: FlStatusHelper.getInfoStatus('ARCHIVED', 'archived'),
  SUCCESS: FlStatusHelper.getSuccessStatus('SUCCESS', 'success'),
  ERROR: FlStatusHelper.getErrorStatus('ERROR', 'error'),
  PARTIALLY_RUN: FlStatusHelper.getInfoStatus('PARTIALLY_RUN', 'pr.partially_run', FlStatusHelper.draftIcon),
};

export class CaScenario extends CaBaseEntity implements CaFolderObject {
  title: string;

  @TeRichTextTransform()
  description: TeRichText;

  @Type(() => CaLab)
  lab: CaLab;

  @FlStatusTransform(CA_SCENARIO_STATUS_DICT)
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

  get style(): TdTypeStyle {
    return CA_HIERARCHY_OBJECT_TYPE_INFO.SCENARIO.style;
  }
}
