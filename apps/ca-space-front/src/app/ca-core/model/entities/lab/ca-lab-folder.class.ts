import { ClLuxonDateTimeTransform } from '@monorepo/core-lib';
import { FlArrayObs } from '@monorepo/front-core-lib/fl-core';
import { Type } from 'class-transformer';
import { DateTime } from 'luxon';

import { CaUser } from '../ca-user.class';
import { CaHierarchyObject } from '../folder/ca-hierarchy-object.class';

/**
 * N - N relation between lab and folder
 */
export class CaLabFolder {
  @Type(() => CaHierarchyObject)
  rootFolder: CaHierarchyObject;

  @ClLuxonDateTimeTransform()
  createdAt: DateTime;

  @Type(() => CaUser)
  createdBy: CaUser;
}

export class CaLabFolderDatasource extends FlArrayObs<CaLabFolder> {
  protected equals(a: CaLabFolder, b: CaLabFolder): boolean {
    return a.rootFolder.id === b.rootFolder.id;
  }
}
