import {FlFormInputsManagerConfig, FlSearchConverter, FlSearchCriteriaConverter} from '@monorepo/front-core-lib';
import {Type} from 'class-transformer';
import {FormBuilder, FormGroup} from '@ngneat/reactive-forms';
import {CaCloudProvider} from '../../../model/entities/ca-cloud-provider.class';
import {CaDiskType} from '../../../model/entities/ca-server-info.class';

export class CaServerInfoSearchFields {
  name: string;

  @Type(() => CaCloudProvider)
  cloudProvider: CaCloudProvider;

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

export class CaServerInfoSearch {
  /**
   * Const to configure Form Input Manager for advanced search
   */
  public static advancedSearchManagerConfig: FlFormInputsManagerConfig<CaServerInfoSearchFields> = {
    cloudProvider: 'cloud_provider',
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
  public static advancedSearchConverter: FlSearchCriteriaConverter<CaServerInfoSearchFields> = {
    name: {key: 'name', operator: 'CONTAINS'},
    cloudProvider: {key: 'cloudProvider.id', operator: 'EQ', convertValue: FlSearchConverter.getEntityId},
    ram: {key: 'ram', operator: 'EQ'},
    diskSpace: {key: 'diskSpace', operator: 'EQ'},
    diskType: {key: 'diskType', operator: 'EQ'},
    cpuCount: {key: 'cpuCount', operator: 'EQ'},
    cpuType: {key: 'cpuType', operator: 'CONTAINS'},
    hasGpu: {key: 'gpuCount', operator: 'GE', convertValue: CaServerInfoSearch.convertHasGpuValue},
    id: {key: 'id', operator: 'EQ'},
  };

  public static getAdvancedSearchForm(): FormGroup<CaServerInfoSearchFields> {
    return new FormBuilder().group(
      {
        name: [null],
        cloudProvider: [null],
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
