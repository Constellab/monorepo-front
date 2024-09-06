import { ClLuxonDateTimeTransform } from '@monorepo/core-lib';
import { DateTime } from 'luxon';
import { Type } from 'class-transformer';
import { CaUser } from '../ca-user.class';
import { FlArrayObs } from '@monorepo/front-core-lib';
import { CaFolder } from '../project/ca-folder.class';

/**
 * N - N relation between lab instance and project
 */
export class CaLabProject {

  @Type(() => CaFolder)
  rootFolder: CaFolder;

  @ClLuxonDateTimeTransform()
  createdAt: DateTime;

  @Type(() => CaUser)
  createdBy: CaUser;
}

export class CaLabInstanceProjectDatasource extends FlArrayObs<CaLabProject> {

  protected equals(a: CaLabProject, b: CaLabProject): boolean {
    return a.rootFolder.id === b.rootFolder.id;
  }
}
