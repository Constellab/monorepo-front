import { ClLuxonDateTimeTransform } from '@monorepo/core-lib';
import { TdTypeStyle } from '@monorepo/technical-doc';
import { Type } from 'class-transformer';
import { DateTime } from 'luxon';

import { CaBaseEntity } from '../ca-base-entity.class';
import { CaUser } from '../ca-user.class';
import { CaFolderObject } from './ca-folder.class';
import { CA_HIERARCHY_OBJECT_TYPE_INFO } from './ca-hierarchy-object.class';

export class CaNote extends CaBaseEntity implements CaFolderObject {
  title: string;

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
    return CA_HIERARCHY_OBJECT_TYPE_INFO.NOTE.style;
  }
}
