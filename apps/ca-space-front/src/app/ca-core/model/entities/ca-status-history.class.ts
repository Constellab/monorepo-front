import { ClLuxonDateTimeTransform } from '@monorepo/core-lib';
import { FlStatus } from '@monorepo/front-core-lib/fl-status';
import { DateTime } from 'luxon';

import { CaBaseEntity } from './ca-base-entity.class';

export abstract class CaStatusHistory<S extends string> extends CaBaseEntity {
  @ClLuxonDateTimeTransform()
  endDate: DateTime;

  // status of this history
  status: FlStatus<S>;
}
