import {Component, OnInit} from '@angular/core';
import {CaLabInstanceDetailPageState} from '../../state/ca-lab-instance-detail-page.state';
import {CaLabInstanceService} from '../../../ca-core/service-api/ca-lab-instance.service';
import {
  FlEntityPaginatedDatasource,
  FlFormInputsManagerConfig,
  FlSavedSearch,
  FlSearchConfig,
  FlSearchConverter,
  FlSearchCriteriaConverter,
  FlSearchDateInterval,
  FlSearchState,
  FlThemeService
} from '@monorepo/front-core-lib';
import {
  CaLabInstanceStatus,
  CaLabInstanceStatusHistoryDatasource
} from '../../../ca-core/model/entities/lab/ca-lab-instance.class';
import {FormBuilder, FormGroup} from '@ngneat/reactive-forms';
import {Type} from 'class-transformer';
import {UntypedFormGroup} from '@angular/forms';


export class CaLabInstanceStatusHistoryDatesFormData {
  @Type(() => FlSearchDateInterval)
  createdAt: FlSearchDateInterval;


  @Type(() => FlSearchDateInterval)
  endDate: FlSearchDateInterval;

  status: CaLabInstanceStatus;
}

export class CaLabInstanceStatusHistorySearch {

  public static advancedSearchManagerConfig: FlFormInputsManagerConfig<CaLabInstanceStatusHistoryDatesFormData> = {
    createdAt: 'createdAt',
    endDate: 'endDate',
    status: 'status'
  };

  public static advancedSearchConverter: FlSearchCriteriaConverter<CaLabInstanceStatusHistoryDatesFormData> = {
    createdAt: FlSearchConverter.dateInterval('createdAt'),
    endDate: FlSearchConverter.dateInterval('endDate'),
    status: {key: 'status', operator: 'EQ'}
  };

  public static getAdvancedSearchForm(): FormGroup<CaLabInstanceStatusHistoryDatesFormData> {
    return new FormBuilder().group<CaLabInstanceStatusHistoryDatesFormData>({
      createdAt: new FormBuilder().group<FlSearchDateInterval>({
        from: [null],
        to: [null],
      }),
      endDate: new FormBuilder().group<FlSearchDateInterval>({
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
  datasource: CaLabInstanceStatusHistoryDatasource;

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
      buildAdvancedForm: CaLabInstanceStatusHistorySearch.getAdvancedSearchForm,
      advancedFormClass: CaLabInstanceStatusHistoryDatesFormData,
      savedSearch: this.getSavedSearch(),
      advancedFormManager: {
        config: CaLabInstanceStatusHistorySearch.advancedSearchManagerConfig,
      },
      storeSearchInUrl: true
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
      filtersCriteria: {} as Partial<CaLabInstanceStatusHistoryDatesFormData>
    }];
  }
}
