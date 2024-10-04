import { Component, OnInit } from '@angular/core';
import { CaLabInstanceDetailPageState } from '../../state/ca-lab-instance-detail-page.state';
import { CaLabInstanceService } from '../../../ca-core/service-api/ca-lab-instance.service';
import {
  FlEntityPaginatedDatasource,
  FlFormInputsManagerConfig,
  FlSavedSearch,
  FlSearchConfig,
  FlSearchConverter,
  FlSearchDateInterval,
  FlSearchFilterCriteriaConverter,
  FlSearchSortCriteriaConverter,
  FlSearchState,
  FlThemeService
} from '@monorepo/front-core-lib';
import {
  CaLabInstanceStatus,
  CaLabInstanceStatusHistoryDatasource
} from '../../../ca-core/model/entities/lab/ca-lab-instance.class';
import { FormBuilder, FormGroup, UntypedFormGroup } from '@angular/forms';
import { Type } from 'class-transformer';


export class CaLabInstanceStatusHistorySearchFields {
  @Type(() => FlSearchDateInterval)
  createdAt: FlSearchDateInterval;


  @Type(() => FlSearchDateInterval)
  endDate: FlSearchDateInterval;

  status: CaLabInstanceStatus;
}

export class CaLabInstanceStatusHistorySearch {

  public static searchManagerConfig: FlFormInputsManagerConfig<CaLabInstanceStatusHistorySearchFields> = {
    createdAt: 'createdAt',
    endDate: 'endDate',
    status: 'status'
  };

  public static filterConverter: FlSearchFilterCriteriaConverter<CaLabInstanceStatusHistorySearchFields> = {
    createdAt: FlSearchConverter.dateInterval('createdAt'),
    endDate: FlSearchConverter.dateInterval('endDate'),
    status: {key: 'status', operator: 'EQ'}
  };

  public static sortConverter: FlSearchSortCriteriaConverter = {
    createdAt: 'createdAt',
    status: 'status',
    createdBy: ['createdBy.firstname', 'createdBy.lastname'],
    endDate: 'endDate'
  };

  public static getSearchForm(): FormGroup {
    return new FormBuilder().group({
      createdAt: new FormBuilder().group({
        from: [null],
        to: [null],
      }),
      endDate: new FormBuilder().group({
        from: [null],
        to: [null],
      }),
      status: [null]
    });
  }
}

@Component({
  selector: 'ca-lab-instance-status-history-page',
  templateUrl: './ca-lab-instance-status-history-page.component.html',
  styleUrls: ['./ca-lab-instance-status-history-page.component.scss'],
  providers: [FlSearchState]
})
export class CaLabInstanceStatusHistoryPageComponent implements OnInit {
  id = this.state.getLabInstanceId();
  datasource: CaLabInstanceStatusHistoryDatasource<CaLabInstanceStatusHistorySearchFields>;

  formGp: UntypedFormGroup;

  statusTypes: CaLabInstanceStatus[] = ['LAB_RUNNING', // server and lab running
    'SERVER_STOPPED', // server stopped in the cloud (billing stopped)
    'SERVER_STARTING', // server is starting in the cloud
    'SERVER_STOPPING', // server is stopping in the cloud
    'SERVER_RUNNING', // server running but lab manager and lab are not started (server not configured)|
    'SERVER_CONFIGURED',// server is started and lab manager is running
    'NO_SERVER',
    'ERROR'];


  constructor(private state: CaLabInstanceDetailPageState,
              private labInstanceService: CaLabInstanceService,
              private searchState: FlSearchState<any>,
              private themeService: FlThemeService) {
  }

  ngOnInit(): void {
    this.initDataSource();
    this.initFormGroup();
  }


  private initFormGroup(): void {
    this.formGp = this.searchState.advancedSearchFormGroup;
  }

  private initDataSource(): void {
    const config: FlSearchConfig = {
      version: 1,
      buildAdvancedForm: CaLabInstanceStatusHistorySearch.getSearchForm,
      advancedFormClass: CaLabInstanceStatusHistorySearchFields,
      savedSearch: this.getSavedSearch(),
      advancedFormManager: {
        config: CaLabInstanceStatusHistorySearch.searchManagerConfig,
      },
      storeSearchInUrl: true,
      defaultSort: {key: 'createdAt', direction: 'DESC'}
    };

    this.datasource = new FlEntityPaginatedDatasource(
      (page, size, filters) =>
        this.labInstanceService.getStatusHistoriesDatasource(
          this.id,
          page,
          size,
          filters),
      20, false
    );
    this.searchState.init(config, this.datasource);
  }

  private getSavedSearch(): FlSavedSearch[] {
    return [{
      searchName: 'ca-lab-instance-status-history',
      id: null,
      label: 'All lab instance status history',
      color: this.themeService.getCurrentThemeDetail().primary,
      version: 1,
      default: true,
      filtersCriteria: {} as Partial<CaLabInstanceStatusHistorySearchFields>
    }];
  }
}
