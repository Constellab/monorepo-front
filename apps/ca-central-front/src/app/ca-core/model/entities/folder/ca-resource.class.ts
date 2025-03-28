import { CaBaseEntity } from '../ca-base-entity.class';
import { TdTypeStyle } from '@monorepo/technical-doc';
import { DateTime } from 'luxon';
import { ClLuxonDateTimeTransform } from '@monorepo/core-lib';

export class CaResource extends CaBaseEntity {
  resourceId: string;

  name: string;

  typingName: string;

  style: TdTypeStyle;

  accessUrl: string;

  @ClLuxonDateTimeTransform()
  validUntil: DateTime;
}

export class CaResourceBasicInfo {
  id: string;
  name: string;
}
