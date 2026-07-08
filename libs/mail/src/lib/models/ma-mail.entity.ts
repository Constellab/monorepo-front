import { ClLuxonDateTimeTransform } from '@monorepo/core-lib';
import { FlDatasourcePaginated, FlEntity } from '@monorepo/front-core-lib/fl-core';
import {
  FlStatus,
  FlStatusDict,
  FlStatusHelper,
  flStatusTransform,
} from '@monorepo/front-core-lib/fl-status';
import { DateTime } from 'luxon';

export type MaMailStatus = 'PENDING' | 'SENT' | 'ERROR';

export const MA_MAIL_STATUS_DICT: FlStatusDict<MaMailStatus> = {
  PENDING: FlStatusHelper.getInfoStatus('PENDING', 'maMail.status_PENDING'),
  SENT: FlStatusHelper.getSuccessStatus('SENT', 'maMail.status_SENT'),
  ERROR: FlStatusHelper.getErrorStatus('ERROR', 'maMail.status_ERROR'),
};

export class MaMailEntity implements FlEntity {
  id: string;

  recipients: string;

  subject: string;

  mail: string;

  @flStatusTransform(MA_MAIL_STATUS_DICT)
  status: FlStatus<MaMailStatus>;

  @ClLuxonDateTimeTransform()
  lastModifiedAt: DateTime;

  error?: string;
}

export type MaMailDatasource<F = void> = FlDatasourcePaginated<MaMailEntity, F>;
