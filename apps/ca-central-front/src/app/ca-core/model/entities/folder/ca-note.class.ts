import { CaBaseEntity } from '../ca-base-entity.class';
import { Expose, Type } from 'class-transformer';
import { CaUser } from '../ca-user.class';
import { ClLuxonDateTimeTransform } from '@monorepo/core-lib';
import { DateTime } from 'luxon';
import { CaFolderObject } from './ca-folder.class';
import { RvResourceView } from '@monorepo/resource-view';
import { TeRichTextContent } from '@monorepo/text-editor';

export class CaNote extends CaBaseEntity implements CaFolderObject {

  title: string;

  content: TeRichTextContent;

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

export class CaResourceView {

  view: RvResourceView;

  @Expose({name: 'resource_id'})
  resourceId: string;

  @Expose({name: 'view_config'})
  viewConfig: any;
}
