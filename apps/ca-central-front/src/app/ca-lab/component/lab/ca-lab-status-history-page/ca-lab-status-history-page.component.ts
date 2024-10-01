import { Component, OnInit } from '@angular/core';
import { CaLabDetailPageState } from '../../../state/ca-lab-detail-page.state';
import { CaLabService } from '../../../../ca-core/service-api/ca-lab.service';
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
  CaLabStatus,
  CaLabStatusHistoryDatasource
} from '../../../../ca-core/model/entities/lab/ca-lab.class';
import { FormBuilder, FormGroup, UntypedFormGroup } from '@angular/forms';
import { Type } from 'class-transformer';


export class CaLabStatusHistorySearchFields {
  @Type(() => FlSearchDateInterval)
  createdAt: FlSearchDateInterval;


  @Type(() => FlSearchDateInterval)
  endDate: FlSearchDateInterval;

  status: CaLabStatus;
}

export class CaLabStatusHistorySearch {

  public static searchManagerConfig: FlFormInputsManagerConfig<CaLabStatusHistorySearchFields> = {
    createdAt: 'createdAt',
    endDate: 'endDate',
    status: 'status'
  };

  public static filterConverter: FlSearchFilterCriteriaConverter<CaLabStatusHistorySearchFields> = {
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
  selector: 'ca-lab-status-history-page',
  templateUrl: './ca-lab-status-history-page.component.html',
  styleUrls: ['./ca-lab-status-history-page.component.scss'],
  providers: [FlSearchState]
})
export class CaLabStatusHistoryPageComponent implements OnInit {
  id = this.state.getLabId();
  datasource: CaLabStatusHistoryDatasource<CaLabStatusHistorySearchFields>;

  formGp: UntypedFormGroup;

  statusTypes: CaLabStatus[] = ['LAB_RUNNING', // server and lab running
    'SERVER_STOPPED', // server stopped in the cloud (billing stopped)
    'SERVER_STARTING', // server is starting in the cloud
    'SERVER_STOPPING', // server is stopping in the cloud
    'SERVER_RUNNING', // server running but lab manager and lab are not started (server not configured)|
    'SERVER_CONFIGURED',// server is started and lab manager is running
    'NO_SERVER',
    'ERROR'];


  constructor(private state: CaLabDetailPageState,
              private labService: CaLabService,
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
      buildAdvancedForm: CaLabStatusHistorySearch.getSearchForm,
      advancedFormClass: CaLabStatusHistorySearchFields,
      savedSearch: this.getSavedSearch(),
      advancedFormManager: {
        config: CaLabStatusHistorySearch.searchManagerConfig,
      },
      storeSearchInUrl: true,
      defaultSort: {key: 'createdAt', direction: 'DESC'}
    };

    this.datasource = new FlEntityPaginatedDatasource(
      (page, size, filters) =>
        this.labService.getStatusHistoriesDatasource(
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
      searchName: 'ca-lab-status-history',
      id: null,
      label: 'All lab status history',
      color: this.themeService.getCurrentThemeDetail().primary,
      version: 1,
      default: true,
      filtersCriteria: {} as Partial<CaLabStatusHistorySearchFields>
    }];
  }
}
