import {
  FlSearchFilterCriteriaConverter,
  FlSearchSortCriteriaConverter,
} from '@monorepo/front-core-lib/fl-search';
import { LiCredentialsType } from '@monorepo/lab-lib/li-core';

export class LiCredentialsSearchFields {
  name: string;

  type: LiCredentialsType;
}

export class LiCredentialsSearch {
  /**
   * Convert used by the advanced search to convert the form result to list of {@link FlSearchCriteria}
   */
  public static filterConverter: FlSearchFilterCriteriaConverter<LiCredentialsSearchFields> = {
    name: { key: 'name', operator: 'CONTAINS' },
    type: { key: 'type', operator: 'EQ' },
  };

  public static sortConverter: FlSearchSortCriteriaConverter = {
    name: 'name',
    space: 'space.name',
    virtualHost: 'virtualHost',
    currentStatus: 'currentStatus.status',
    createdBy: ['createdBy.firstname', 'createdBy.lastname'],
    serverCloud: 'serverCloud.serverStandard.name',
  };
}
