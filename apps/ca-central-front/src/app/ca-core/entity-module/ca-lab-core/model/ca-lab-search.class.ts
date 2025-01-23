import { Type } from 'class-transformer';
import { CaUser } from '../../../model/entities/ca-user.class';
import { FlFormInputsManagerConfig } from '@monorepo/front-core-lib/fl-form-inputs-manager';
import { FlSearchConverter } from '@monorepo/front-core-lib/fl-search';
import { FlSearchDateInterval } from '@monorepo/front-core-lib/fl-search';
import { FlSearchFilterCriteriaConverter } from '@monorepo/front-core-lib/fl-search';
import { FlSearchSortCriteriaConverter } from '@monorepo/front-core-lib/fl-search';

import { FormBuilder, FormGroup } from '@angular/forms';
import { CaLabServerTaskStatus, CaLabStatus, CaLabType } from '../../../model/entities/lab/ca-lab.class';
import { CaCity } from '../../../model/entities/ca-city.entity';
import { CaServerCloud } from '../../../model/entities/server/ca-server-cloud.class';
import { CaSpace } from '../../../model/entities/space/ca-space.class';
import { CaCloudProvider } from '../../../model/entities/ca-cloud-provider.class';
import { CaServerStandard } from '../../../model/entities/server/ca-server-standard.class';

export class CaLabSearchFields {
  name: string;

  currentStatus: CaLabStatus;

  virtualHost: string;

  @Type(() => CaCity)
  city: CaCity;

  @Type(() => CaServerCloud)
  serverCloud: CaServerCloud;

  @Type(() => CaServerStandard)
  serverStandard: CaServerStandard;

  @Type(() => CaUser)
  createdBy: CaUser;

  @Type(() => FlSearchDateInterval)
  createdAt: FlSearchDateInterval;

  @Type(() => CaSpace)
  space: CaSpace;

  type: CaLabType;

  @Type(() => CaCloudProvider)
  cloudProvider: CaCloudProvider;

  isFreeLab: boolean;

  cloudName: string;

  serverTaskStatus: CaLabServerTaskStatus;

  id: string;
}

export class CaLabSearch {
  public static searchManagerConfig: FlFormInputsManagerConfig<CaLabSearchFields> = {
    name: 'name',
    currentStatus: 'status',
    virtualHost: 'virtual_host',
    city: 'region',
    serverCloud: 'server_cloud',
    serverStandard: 'server_standard',
    createdBy: 'created_by',
    createdAt: 'creation_date',
    space: 'space',
    type: 'lab_type',
    cloudProvider: 'cloud_provider',
    cloudName: 'lab_cloud_name',
    serverTaskStatus: 'lab_server_task_status',
  };

  public static filterConverter: FlSearchFilterCriteriaConverter<CaLabSearchFields> = {
    name: { key: 'name', operator: 'CONTAINS' },
    currentStatus: { key: 'currentStatus.status', operator: 'EQ' },
    virtualHost: { key: 'virtualHost', operator: 'CONTAINS' },
    city: { key: 'region.city.id', operator: 'EQ', convertValue: FlSearchConverter.getEntityId },
    serverCloud: { key: 'serverCloud.id', operator: 'EQ', convertValue: FlSearchConverter.getEntityId },
    serverStandard: {
      key: 'serverCloud.serverStandard.id',
      operator: 'EQ',
      convertValue: FlSearchConverter.getEntityId,
    },
    createdBy: { key: 'createdBy.id', operator: 'EQ', convertValue: FlSearchConverter.getEntityId },
    createdAt: FlSearchConverter.dateInterval('createdAt'),
    space: { key: 'space.id', operator: 'EQ', convertValue: FlSearchConverter.getEntityId },
    type: { key: 'type', operator: 'EQ' },
    cloudProvider: {
      key: 'region.cloudProvider.id',
      operator: 'EQ',
      convertValue: FlSearchConverter.getEntityId,
    },
    isFreeLab: { key: 'isFreeLab', operator: 'EQ' },
    cloudName: { key: 'cloudName', operator: 'CONTAINS' },
    serverTaskStatus: { key: 'serverTaskStatus', operator: 'EQ' },
    id: { key: 'id', operator: 'EQ' },
  };

  public static sortConverter: FlSearchSortCriteriaConverter = {
    name: 'name',
    space: 'space.name',
    virtualHost: 'virtualHost',
    currentStatus: 'currentStatus.status',
    createdBy: ['createdBy.firstname', 'createdBy.lastname'],
    serverCloud: 'serverCloud.serverStandard.name',
  };

  public static getSearchForm(): FormGroup {
    return new FormBuilder().group({
      name: null,
      currentStatus: null,
      virtualHost: null,
      city: null,
      serverCloud: null,
      serverStandard: null,
      createdBy: null,
      createdAt: new FormBuilder().group({
        from: [null],
        to: [null],
      }),
      space: null,
      type: null,
      cloudProvider: null,
      isFreeLab: null,
      cloudName: null,
      serverTaskStatus: null,
      id: null,
    });
  }
}
