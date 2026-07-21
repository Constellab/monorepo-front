import { ChangeDetectionStrategy,Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, UntypedFormGroup } from '@angular/forms';
import { MatOption } from '@angular/material/core';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatSelect } from '@angular/material/select';
import { FlCardModule } from '@monorepo/front-core-lib/fl-card';
import { FlEntityPaginatedDatasource } from '@monorepo/front-core-lib/fl-core';
import { FlFormInputsManagerConfig } from '@monorepo/front-core-lib/fl-form-inputs-manager';
import {
  FlSavedSearch,
  FlSearchConfig,
  FlSearchConverter,
  FlSearchDateInterval,
  FlSearchFilterCriteriaConverter,
  FlSearchModule,
  FlSearchSortCriteriaConverter,
  FlSearchState,
} from '@monorepo/front-core-lib/fl-search';
import { FlTextIconModule } from '@monorepo/front-core-lib/fl-text-icon';
import { FlThemeService } from '@monorepo/front-core-lib/fl-theme';
import { TranslatePipe } from '@ngx-translate/core';
import { Type } from 'class-transformer';

import {
  CaLabStatus,
  CaLabStatusHistoryDatasource,
} from '../../../../ca-core/model/entities/lab/ca-lab.class';
import { CaStatusHistoryTableComponent } from '../../../../ca-core/module/ca-status/ca-status-history-table/ca-status-history-table.component';
import { CaLabService } from '../../../../ca-core/service-api/ca-lab.service';
import { CaLabDetailPageState } from '../../../state/ca-lab-detail-page.state';

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
    status: 'status',
  };

  public static filterConverter: FlSearchFilterCriteriaConverter<CaLabStatusHistorySearchFields> = {
    createdAt: FlSearchConverter.dateInterval('createdAt'),
    endDate: FlSearchConverter.dateInterval('endDate'),
    status: { key: 'status', operator: 'EQ' },
  };

  public static sortConverter: FlSearchSortCriteriaConverter = {
    createdAt: 'createdAt',
    status: 'status',
    createdBy: ['createdBy.firstname', 'createdBy.lastname'],
    endDate: 'endDate',
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
      status: [null],
    });
  }
}

@Component({
  selector: 'ca-lab-status-history-page',
  templateUrl: './ca-lab-status-history-page.component.html',
  styleUrls: ['./ca-lab-status-history-page.component.scss'],
  providers: [FlSearchState],
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    FlCardModule,
    FlTextIconModule,
    MatIcon,
    FlSearchModule,
    ReactiveFormsModule,
    MatFormField,
    MatLabel,
    MatSelect,
    MatOption,
    CaStatusHistoryTableComponent,
    TranslatePipe,
  ],
})
export class CaLabStatusHistoryPageComponent implements OnInit {
  private state = inject(CaLabDetailPageState);
  private labService = inject(CaLabService);
  private searchState = inject<FlSearchState<any>>(FlSearchState);
  private themeService = inject(FlThemeService);

  id = this.state.getLabId();
  datasource: CaLabStatusHistoryDatasource<CaLabStatusHistorySearchFields>;

  formGp: UntypedFormGroup;

  statusTypes: CaLabStatus[] = [
    'LAB_RUNNING', // server and lab running
    'SERVER_STOPPED', // server stopped in the cloud (billing stopped)
    'SERVER_STARTING', // server is starting in the cloud
    'SERVER_STOPPING', // server is stopping in the cloud
    'SERVER_RUNNING', // server running but lab manager and lab are not started (server not configured)|
    'SERVER_CONFIGURED', // server is started and lab manager is running
    'NO_SERVER',
    'ERROR',
  ];

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
      defaultSort: { key: 'createdAt', direction: 'DESC' },
    };

    this.datasource = new FlEntityPaginatedDatasource(
      (page, size, filters) => this.labService.getStatusHistoriesDatasource(this.id, page, size, filters),
      20,
      { initFirstPage: false }
    );
    this.searchState.init(config, this.datasource);
  }

  private getSavedSearch(): FlSavedSearch[] {
    return [
      {
        searchName: 'ca-lab-status-history',
        id: null,
        label: 'All lab status history',
        color: this.themeService.getCurrentThemeDetail().primary,
        version: 1,
        default: true,
        filtersCriteria: {} as Partial<CaLabStatusHistorySearchFields>,
      },
    ];
  }
}
