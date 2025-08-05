import { ClLuxonDateTimeTransform } from '@monorepo/core-lib';
import { RvResourceView } from '@monorepo/resource-view';
import { TdTypeStyle } from '@monorepo/technical-doc';
import { Expose, Type } from 'class-transformer';
import { DateTime } from 'luxon';

import { CaBaseEntity } from '../ca-base-entity.class';
import { CaUser } from '../ca-user.class';
import { CaFolderObject } from './ca-folder.class';
import { caHierarchyObjectTypeInfos } from './ca-hierarchy-object.class';

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
    return caHierarchyObjectTypeInfos.NOTE.style;
  }
}

export class CaResourceView {
  view: RvResourceView;

  @Expose({ name: 'resource_id' })
  resourceId: string;

  @Expose({ name: 'view_config' })
  viewConfig: any;
}
