import { FlEntityPaginatedDatasource } from '@monorepo/front-core-lib/fl-core';
import { LiBaseEntity } from '@monorepo/lab-lib/li-core';

// export type BiotaDataVM = ViewModel<BiotaData>;

/**
 * One line of biota database
 */
export class LabBiotaData extends LiBaseEntity {
  name: string;

  sbo_id: string;

  data: any;
}

export type LabBiotaDataDatasource = FlEntityPaginatedDatasource<LabBiotaData>;
