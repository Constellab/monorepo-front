import { Type } from 'class-transformer';
import { CaUser } from '../../../model/entities/ca-user.class';
import {
  FlFormInputsManagerConfig,
  FlSearchConverter,
  FlSearchCriteriaConverter,
  FlSearchDateInterval
} from '@monorepo/front-core-lib';
import { FormBuilder, FormGroup } from '@ngneat/reactive-forms';

export class CaProjectSearchFields {

  code: string;

  title: string;

  @Type(() => FlSearchDateInterval)
  startingDate: FlSearchDateInterval;

  @Type(() => FlSearchDateInterval)
  endingDate: FlSearchDateInterval;

  @Type(() => CaUser)
  leader: CaUser;

  @Type(() => FlSearchDateInterval)
  createdAt: FlSearchDateInterval;

  includeSubProjects: boolean;

  id: string;
}

export class CaProjectSearch {

  public static advancedSearchManagerConfig: FlFormInputsManagerConfig<CaProjectSearchFields> = {
    code: 'code',
    title: 'title',
    startingDate: 'starting_date',
    endingDate: 'ending_date',
    leader: 'project_leader',
    createdAt: 'creation_date',
    includeSubProjects: 'include_sub_projects'
  };

  public static advancedSearchConverter: FlSearchCriteriaConverter<CaProjectSearchFields> = {
    code: { key: 'code', operator: 'MATCH' },
    title: { key: 'title', operator: 'MATCH' },
    startingDate: FlSearchConverter.dateInterval('startingDate'),
    endingDate: FlSearchConverter.dateInterval('endingDate'),
    leader: { key: 'createdBy.id', operator: 'EQ', convertValue: FlSearchConverter.getEntityId },
    createdAt: FlSearchConverter.dateInterval('createdAt'),
    includeSubProjects: { key: 'includeSubProjects', operator: 'EQ' },
    id: { key: 'id', operator: 'EQ' }
  };

  public static getAdvancedSearchForm(): FormGroup<CaProjectSearchFields> {
    return new FormBuilder().group<CaProjectSearchFields>({
      code: null,
      title: null,
      startingDate: new FormBuilder().group<FlSearchDateInterval>({
        from: [null],
        to: [null]
      }),
      endingDate: new FormBuilder().group<FlSearchDateInterval>({
        from: [null],
        to: [null]
      }),
      leader: null,
      createdAt: new FormBuilder().group<FlSearchDateInterval>({
        from: [null],
        to: [null]
      }),
      includeSubProjects: null,
      id: null
    });
  }
}
