import {FlFormInputsManagerConfig, FlSearchConverter, FlSearchCriteriaConverter} from '@monorepo/front-core-lib';
import {Type} from 'class-transformer';
import {FormBuilder, FormGroup} from '@ngneat/reactive-forms';
import {CaCloudProvider} from '../../../model/entities/ca-cloud-provider.class';
import {CaDiskType} from '../../../model/entities/server/ca-server-cloud.class';
import {CaServerStandard} from '../../../model/entities/server/ca-server-standard.class';

export class CaServerCloudSearchFields {
  technicalName: string;

  @Type(() => CaCloudProvider)
  cloudProvider: CaCloudProvider;

  @Type(() => CaServerStandard)
  serverStandard: CaServerStandard;

  ram: number;

  diskSpace: number;

  // type of disk, SSD or HDD
  diskType: CaDiskType;

  // number of CPU
  cpuCount: number;

  // info about the cpu
  cpuType: string;

  hasGpu: boolean;

  id: string;
}

export class CaServerCloudSearch {
  /**
   * Const to configure Form Input Manager for advanced search
   */
  public static advancedSearchManagerConfig: FlFormInputsManagerConfig<CaServerCloudSearchFields> = {
    technicalName: 'technical_name',
    cloudProvider: 'cloud_provider',
    serverStandard: 'server_standard',
    ram: 'ram',
    hasGpu: 'has_gpus',
  };

  private static convertHasGpuValue(hasGpu: boolean): any {
    if (hasGpu) {
      return 1;
    }
    return 0;
  }


  /**
   * Convert used by the advanced search to convert the form result to list of {@link FlSearchCriteria}
   */
  public static advancedSearchConverter: FlSearchCriteriaConverter<CaServerCloudSearchFields> = {
    technicalName: {key: 'technicalName', operator: 'CONTAINS'},
    cloudProvider: {key: 'cloudProvider.id', operator: 'EQ', convertValue: FlSearchConverter.getEntityId},
    serverStandard: {key: 'serverStandard.id', operator: 'EQ', convertValue: FlSearchConverter.getEntityId},
    ram: {key: 'ram', operator: 'EQ'},
    diskSpace: {key: 'diskSpace', operator: 'EQ'},
    diskType: {key: 'diskType', operator: 'EQ'},
    cpuCount: {key: 'cpuCount', operator: 'EQ'},
    cpuType: {key: 'cpuType', operator: 'CONTAINS'},
    hasGpu: {key: 'gpuCount', operator: 'GE', convertValue: CaServerCloudSearch.convertHasGpuValue},
    id: {key: 'id', operator: 'EQ'},
  };

  public static getAdvancedSearchForm(): FormGroup<CaServerCloudSearchFields> {
    return new FormBuilder().group(
      {
        technicalName: [null],
        cloudProvider: [null],
        serverStandard : [null],
        ram: [null],
        diskSpace: [null],
        diskType: [null],
        cpuCount: [null],
        cpuType: [null],
        hasGpu: [null],
        id: [null],
      }
    );
  }

}
