import { FlDatasourcePaginated, FlEntity } from '@monorepo/front-core-lib/fl-core';
import {
  FlStatus,
  FlStatusDict,
  FlStatusHelper,
  FlStatusTransform,
} from '@monorepo/front-core-lib/fl-status';

import { ClLuxonDateTimeTransform } from '@monorepo/core-lib';
import { DateTime } from 'luxon';

export type MaMailStatus = 'PENDING' | 'SENT' | 'ERROR';

export const maMailStatusDict: FlStatusDict<MaMailStatus> = {
  PENDING: FlStatusHelper.getInfoStatus('PENDING', 'maMail.status_PENDING'),
  SENT: FlStatusHelper.getSuccessStatus('SENT', 'maMail.status_SENT'),
  ERROR: FlStatusHelper.getErrorStatus('ERROR', 'maMail.status_ERROR'),
};

export class MaMailEntity implements FlEntity {
  id: string;

  recipients: string;

  subject: string;

  mail: string;

  @FlStatusTransform(maMailStatusDict)
  status: FlStatus<MaMailStatus>;

  @ClLuxonDateTimeTransform()
  lastModifiedAt: DateTime;

  error?: string;
}

export type MaMailDatasource<F = void> = FlDatasourcePaginated<MaMailEntity, F>;
