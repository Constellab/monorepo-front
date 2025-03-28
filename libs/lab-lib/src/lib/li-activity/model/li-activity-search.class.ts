import { ActivityObjectType, ActivityType, LiUser } from '@monorepo/lab-lib/li-core';
import { FlFormInputsManagerConfig } from '@monorepo/front-core-lib/fl-form-inputs-manager';
import {
  FlSearchConverter,
  FlSearchDateInterval,
  FlSearchFilterCriteriaConverter,
  FlSearchSortCriteriaConverter,
} from '@monorepo/front-core-lib/fl-search';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Type } from 'class-transformer';

export class LiActivitySearchFields {
  @Type(() => LiUser)
  user: LiUser;

  activityType: ActivityType[];

  activityObjectType: ActivityObjectType[];

  objectId: string;

  @Type(() => FlSearchDateInterval)
  createdAt: FlSearchDateInterval;
}

export class LiActivitySearch {
  /**
   * Const to configure Form Input Manager for advanced search
   */
  public static searchManagerConfig: FlFormInputsManagerConfig<LiActivitySearchFields> = {
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
  public static filterConverter: FlSearchFilterCriteriaConverter<LiActivitySearchFields> = {
    user: { key: 'user', operator: 'EQ', convertValue: FlSearchConverter.getEntityId },
    activityType: { key: 'activity_type', operator: 'IN' },
    activityObjectType: { key: 'object_type', operator: 'IN' },
    objectId: { key: 'object_id', operator: 'EQ' },
    createdAt: FlSearchConverter.dateInterval('created_at'),
  };

  public static sortConverter: FlSearchSortCriteriaConverter = {
    activity_type: 'activity_type',
    objectType: 'object_type',
    objectId: 'object_id',
    date: 'last_modified_at',
  };

  public static getSearchForm(): FormGroup {
    return new FormBuilder().group({
      user: [null],
      activityType: [null],
      activityObjectType: [null],
      objectId: [null],
      createdAt: new FormBuilder().group({
        from: [null],
        to: [null],
      }),
    });
  }
}
