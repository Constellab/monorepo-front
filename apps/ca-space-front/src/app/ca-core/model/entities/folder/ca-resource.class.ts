import { ClLuxonDateTimeTransform } from '@monorepo/core-lib';
import { FlEntity } from '@monorepo/front-core-lib/fl-core';
import { TdTypeStyle } from '@monorepo/technical-doc';
import { DateTime } from 'luxon';

import { CaRootFolderUserRoleObj } from './ca-folder-user.class';

export class CaResource implements FlEntity {
  id: string;

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
  userRole: CaRootFolderUserRoleObj;
}
