import {
  FlFormInputsManagerConfig,
  FlSearchConverter,
  FlSearchDateInterval,
  FlSearchFilterCriteriaConverter,
  FlSearchSortCriteriaConverter
} from '@monorepo/front-core-lib';
import { Type } from 'class-transformer';
import { FormBuilder, FormGroup } from '@ngneat/reactive-forms';
import { LabUser } from '../../../model/entities/lab-user.entity';
import { ActivityObjectType, ActivityType } from '../../../model/entities/lab-activity.entity';


export class LabActivitySearchFields {
  @Type(() => LabUser)
  user: LabUser;

  activityType: ActivityType[];

  activityObjectType: ActivityObjectType[];

  objectId: string;

  @Type(() => FlSearchDateInterval)
  createdAt: FlSearchDateInterval;
}

export class LabActivitySearch {
  /**
   * Const to configure Form Input Manager for advanced search
   */
  public static searchManagerConfig: FlFormInputsManagerConfig<LabActivitySearchFields> = {
    user: 'monitoring.activity_user',
    activityType: 'monitoring.activity_type',
    activityObjectType: 'monitoring.activity_object_type',
    objectId: 'monitoring.activity_object_id',
    // group the creation date into one chip
    createdAt: 'monitoring.activity_date',
  };


  /**
   * Convert used by the advanced search to convert the form result to list of {@link FlSearchCriteria}
   */
  public static filterConverter: FlSearchFilterCriteriaConverter<LabActivitySearchFields> = {
    user: {key: 'user', operator: 'EQ', convertValue: FlSearchConverter.getEntityId},
    activityType: {key: 'activity_type', operator: 'IN'},
    activityObjectType: {key: 'object_type', operator: 'IN'},
    objectId: {key: 'object_id', operator: 'EQ'},
    createdAt: FlSearchConverter.dateInterval('created_at'),
  };

  public static sortConverter: FlSearchSortCriteriaConverter = {
    activity_type: 'activity_type',
    objectType: 'object_type',
    objectId: 'object_id',
    date: 'last_modified_at',
  };

  public static getSearchForm(): FormGroup<LabActivitySearchFields> {
    return new FormBuilder().group(
      {
        user: [null],
        activityType: [null],
        activityObjectType: [null],
        objectId: [null],
        createdAt: new FormBuilder().group<FlSearchDateInterval>({
          from: [null],
          to: [null],
        })
      }
    );
  }

}
