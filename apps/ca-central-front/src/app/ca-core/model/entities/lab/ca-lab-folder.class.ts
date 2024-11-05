import { ClLuxonDateTimeTransform } from '@monorepo/core-lib';
import { DateTime } from 'luxon';
import { Type } from 'class-transformer';
import { CaUser } from '../ca-user.class';
import { FlArrayObs } from '@monorepo/front-core-lib';
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
