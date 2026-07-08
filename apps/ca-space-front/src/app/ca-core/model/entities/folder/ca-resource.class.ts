import { ClLuxonDateTimeTransform } from '@monorepo/core-lib';
import { FlEntity } from '@monorepo/front-core-lib/fl-core';
import { TdTypeStyle } from '@monorepo/technical-doc';
import { DateTime } from 'luxon';

import { CaRootFolderUserRoleObj } from './ca-folder-user.class';
import { CaHierarchyObjectType } from './ca-hierarchy-object.class';

export class CaResource implements FlEntity {
  id: string;

  resourceId: string;

  name: string;

  typingName: string;

  style: TdTypeStyle;

  // Url to embed the resource in an iframe in place.
  embeddedUrl: string;

  // Url to open the resource standalone (new tab), for apps through the launcher gateway.
  standaloneUrl: string;

  @ClLuxonDateTimeTransform()
  validUntil: DateTime;

  isApplication: boolean;

  public getHierarchyObjectType(): CaHierarchyObjectType {
    return this.isApplication ? CaHierarchyObjectType.APPLICATION : CaHierarchyObjectType.RESOURCE;
  }
}

export class CaResourceBasicInfo {
  id: string;
  name: string;
  userRole: CaRootFolderUserRoleObj;
}
