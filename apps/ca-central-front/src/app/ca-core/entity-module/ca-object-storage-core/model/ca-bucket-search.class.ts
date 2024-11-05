import {
  FlFormInputsManagerConfig,
  FlSearchConverter,
  FlSearchDateInterval,
  FlSearchFilterCriteriaConverter,
  FlSearchSortCriteriaConverter,
} from '@monorepo/front-core-lib';
import { Type } from 'class-transformer';
import { FormBuilder, FormGroup } from '@angular/forms';
import {
  CaBucketContentType,
  CaBucketCredentials,
  CaBucketType,
} from '../../../model/entities/ca-object-storage.class';
import { CaSpace } from '../../../model/entities/space/ca-space.class';
import { CaUser } from '../../../model/entities/ca-user.class';
import { CaCloudProviderRegion } from '../../../model/entities/ca-cloud-provider.class';
import { CaLab } from '../../../model/entities/lab/ca-lab.class';

export class CaBucketSearchFields {
  name: string;

  contentType: CaBucketContentType;

  bucketType: CaBucketType;

  @Type(() => CaSpace)
  space: CaSpace;

  @Type(() => CaCloudProviderRegion)
  region: CaCloudProviderRegion;

  @Type(() => CaLab)
  lab: CaLab;

  @Type(() => CaBucketCredentials)
  credentials: CaBucketCredentials;

  @Type(() => FlSearchDateInterval)
  createdAt: FlSearchDateInterval;

  @Type(() => CaUser)
  createdBy: CaUser;

  @Type(() => FlSearchDateInterval)
  lastModifiedAt: FlSearchDateInterval;

  @Type(() => CaUser)
  lastModifiedBy: CaUser;

  id: string;
}

export class CaBucketSearch {
  /**
   * Const to configure Form Input Manager for advanced search
   */
  public static searchManagerConfig: FlFormInputsManagerConfig<CaBucketSearchFields> = {
    contentType: 'bucket_content_type',
    bucketType: 'bucket_type',
    region: 'cloud_provider_region',
    lab: 'lab',
    credentials: 'bucket_credentials',
    createdAt: 'creation_date',
    createdBy: 'created_by',
    lastModifiedAt: 'last_modification_date',
    lastModifiedBy: 'last_modified_by',
  };

  /**
   * Convert used by the advanced search to convert the form result to list of {@link FlSearchCriteria}
   */
  public static filterConverter: FlSearchFilterCriteriaConverter<CaBucketSearchFields> = {
    name: { key: 'name', operator: 'CONTAINS' },
    contentType: { key: 'contentType', operator: 'IN' },
    bucketType: { key: 'bucketType', operator: 'IN' },
    space: { key: 'space.id', operator: 'EQ', convertValue: FlSearchConverter.getEntityId },
    region: { key: 'region.id', operator: 'EQ', convertValue: FlSearchConverter.getEntityId },
    lab: { key: 'lab.id', operator: 'EQ', convertValue: FlSearchConverter.getEntityId },
    credentials: { key: 'credentials.id', operator: 'EQ', convertValue: FlSearchConverter.getEntityId },
    // Date
    createdBy: { key: 'createdBy.id', operator: 'EQ', convertValue: FlSearchConverter.getEntityId },
    createdAt: FlSearchConverter.dateInterval('createdAt'),
    lastModifiedAt: FlSearchConverter.dateInterval('lastModifiedAt'),
    lastModifiedBy: { key: 'lastModifiedBy.id', operator: 'EQ', convertValue: FlSearchConverter.getEntityId },
    id: { key: 'id', operator: 'EQ' },
  };

  public static sortConverter: FlSearchSortCriteriaConverter = {
    name: 'name',
    contentType: 'contentType',
    created: 'createdAt',
    lastModified: 'lastModifiedAt',
  };

  public static getSearchForm(): FormGroup {
    return new FormBuilder().group({
      name: [null],
      contentType: [null],
      bucketType: [null],
      space: [null],
      region: [null],
      lab: [null],
      credentials: [null],
      createdBy: [null],
      createdAt: new FormBuilder().group({
        from: [null],
        to: [null],
      }),
      lastModifiedAt: new FormBuilder().group({
        from: [null],
        to: [null],
      }),
      lastModifiedBy: [null],
      id: [null],
    });
  }
}
