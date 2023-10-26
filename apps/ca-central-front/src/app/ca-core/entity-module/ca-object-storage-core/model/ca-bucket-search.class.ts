import {
  FlFormInputsManagerConfig,
  FlSearchConverter,
  FlSearchCriteriaConverter,
  FlSearchDateInterval
} from '@monorepo/front-core-lib';
import {Type} from 'class-transformer';
import {FormBuilder, FormGroup} from '@ngneat/reactive-forms';
import {CaBucketContentType, CaBucketCredentials} from '../../../model/entities/ca-object-storage.class';
import {CaSpace} from '../../../model/entities/space/ca-space.class';
import {CaUser} from '../../../model/entities/ca-user.class';
import {CaCloudProviderRegion} from '../../../model/entities/ca-cloud-provider.class';

export class CaBucketSearchFields {
  name: string;

  contentType: CaBucketContentType;


  @Type(() => CaSpace)
  space: CaSpace;

  region: CaCloudProviderRegion;

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
  public static advancedSearchManagerConfig: FlFormInputsManagerConfig<CaBucketSearchFields> = {
    contentType: 'bucket_content_type',
    region: 'cloud_provider_region',
    credentials: 'bucket_credentials',
    createdAt: 'creation_date',
    createdBy: 'created_by',
    lastModifiedAt: 'last_modification_date',
    lastModifiedBy: 'last_modified_by',
  };


  /**
   * Convert used by the advanced search to convert the form result to list of {@link FlSearchCriteria}
   */
  public static advancedSearchConverter: FlSearchCriteriaConverter<CaBucketSearchFields> = {
    name: {key: 'name', operator: 'CONTAINS'},
    contentType: {key: 'contentType', operator: 'IN'},
    space: {key: 'space.id', operator: 'EQ', convertValue: FlSearchConverter.getEntityId},
    region: {key: 'region.id', operator: 'EQ', convertValue: FlSearchConverter.getEntityId},
    credentials: {key: 'credentials.id', operator: 'EQ', convertValue: FlSearchConverter.getEntityId},
    // Date
    createdBy: {key: 'createdBy.id', operator: 'EQ', convertValue: FlSearchConverter.getEntityId},
    createdAt: FlSearchConverter.dateInterval('createdAt'),
    lastModifiedAt: FlSearchConverter.dateInterval('lastModifiedAt'),
    lastModifiedBy: {key: 'lastModifiedBy.id', operator: 'EQ', convertValue: FlSearchConverter.getEntityId},
    id: {key: 'id', operator: 'EQ'},
  };

  public static getAdvancedSearchForm(): FormGroup<CaBucketSearchFields> {
    return new FormBuilder().group(
      {
        name: [null],
        contentType: [null],
        space: [null],
        region: [null],
        credentials: [null],
        createdBy: [null],
        createdAt: new FormBuilder().group<FlSearchDateInterval>({
          from: [null],
          to: [null],
        }),
        lastModifiedAt: new FormBuilder().group<FlSearchDateInterval>({
          from: [null],
          to: [null],
        }),
        lastModifiedBy: [null],
        id: [null],
      }
    );
  }

}
