import { FlSearchFilterCriteriaConverter, FlSearchSortCriteriaConverter } from '@monorepo/front-core-lib';
import { LabCredentialsType } from '../../../../model/entities/lab-credentials.entity';


export class LabCredentialsSearchFields {
  name: string;

  type: LabCredentialsType;

}

export class LabCredentialsSearch {

  /**
   * Convert used by the advanced search to convert the form result to list of {@link FlSearchCriteria}
   */
  public static filterConverter: FlSearchFilterCriteriaConverter<LabCredentialsSearchFields> = {
    name: {key: 'name', operator: 'CONTAINS'},
    type: {key: 'type', operator: 'EQ'},
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
