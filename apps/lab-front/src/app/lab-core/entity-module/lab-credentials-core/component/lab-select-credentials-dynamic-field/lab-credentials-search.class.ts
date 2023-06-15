import {FlSearchCriteriaConverter} from '@monorepo/front-core-lib';
import {LabCredentialsType} from '../../../../model/entities/lab-credentials.entity';


export class LabCredentialsSearchFields {
  name: string;

  type: LabCredentialsType;

}

export class LabCredentialsSearch {

  /**
   * Convert used by the advanced search to convert the form result to list of {@link FlSearchCriteria}
   */
  public static advancedSearchConverter: FlSearchCriteriaConverter<LabCredentialsSearchFields> = {
    name: {key: 'name', operator: 'CONTAINS'},
    type: {key: 'type', operator: 'EQ'},
  };

}
