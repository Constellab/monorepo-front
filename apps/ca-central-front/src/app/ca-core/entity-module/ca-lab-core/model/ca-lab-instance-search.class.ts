import {Type} from 'class-transformer';
import {CaUser} from '../../../model/entities/ca-user.class';
import {
  FlFormInputsManagerConfig,
  FlSearchConverter,
  FlSearchCriteriaConverter,
  FlSearchDateInterval
} from '@monorepo/front-core-lib';
import {FormBuilder, FormGroup} from '@ngneat/reactive-forms';
import {
  CaLabInstanceServerTaskStatus,
  CaLabInstanceStatus,
  CaLabInstanceType
} from '../../../model/entities/lab/ca-lab-instance.class';
import {CaCity} from '../../../model/entities/ca-city.entity';
import {CaServerCloud} from '../../../model/entities/server/ca-server-cloud.class';
import {CaSpace} from '../../../model/entities/space/ca-space.class';
import {CaCloudProvider} from '../../../model/entities/ca-cloud-provider.class';
import {CaServerStandard} from '../../../model/entities/server/ca-server-standard.class';


export class CaLabInstanceSearchFields {

  name: string;

  currentStatus: CaLabInstanceStatus;

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

  type: CaLabInstanceType;

  @Type(() => CaCloudProvider)
  cloudProvider: CaCloudProvider;

  isFreeTrial: boolean;

  cloudName: string;

  serverTaskStatus: CaLabInstanceServerTaskStatus;

  id: string;
}

export class CaLabInstanceSearch {

  public static advancedSearchManagerConfig: FlFormInputsManagerConfig<CaLabInstanceSearchFields> = {
    name: 'name',
    currentStatus: 'status',
    virtualHost: 'virtual_host',
    city: 'region',
    serverCloud: 'server_cloud',
    serverStandard: 'server_standard',
    createdBy: 'created_by',
    createdAt: 'creation_date',
    space: 'space',
    type: 'lab_instance_type',
    cloudProvider: 'cloud_provider',
    cloudName: 'lab_cloud_name',
    serverTaskStatus: 'lab_server_task_status'
  };

  public static advancedSearchConverter: FlSearchCriteriaConverter<CaLabInstanceSearchFields> = {
    name: {key: 'name', operator: 'MATCH'},
    currentStatus: {key: 'currentStatus.status', operator: 'EQ'},
    virtualHost: {key: 'virtualHost', operator: 'MATCH'},
    city: {key: 'region.city.id', operator: 'EQ', convertValue: FlSearchConverter.getEntityId},
    serverCloud: {key: 'serverCloud.id', operator: 'EQ', convertValue: FlSearchConverter.getEntityId},
    serverStandard: {key: 'serverCloud.serverStandard.id', operator: 'EQ', convertValue: FlSearchConverter.getEntityId},
    createdBy: {key: 'createdBy.id', operator: 'EQ', convertValue: FlSearchConverter.getEntityId},
    createdAt: FlSearchConverter.dateInterval('createdAt'),
    space: {key: 'space.id', operator: 'EQ', convertValue: FlSearchConverter.getEntityId},
    type: {key: 'type', operator: 'EQ'},
    cloudProvider: {key: 'region.cloudProvider.id', operator: 'EQ', convertValue: FlSearchConverter.getEntityId},
    isFreeTrial: {key: 'isFreeTrial', operator: 'EQ'},
    cloudName: {key: 'cloudName', operator: 'MATCH'},
    serverTaskStatus: {key: 'serverTaskStatus', operator: 'EQ'},
    id: {key: 'id', operator: 'EQ'},
  };

  public static getAdvancedSearchForm(): FormGroup<CaLabInstanceSearchFields> {
    return new FormBuilder().group<CaLabInstanceSearchFields>({
      name: null,
      currentStatus: null,
      virtualHost: null,
      city: null,
      serverCloud: null,
      serverStandard: null,
      createdBy: null,
      createdAt: new FormBuilder().group<FlSearchDateInterval>({
        from: [null],
        to: [null],
      }),
      space: null,
      type: null,
      cloudProvider: null,
      isFreeTrial: null,
      cloudName: null,
      serverTaskStatus: null,
      id: null,
    });
  }
}
