import { Component, OnInit } from '@angular/core';
import {
  FlDialogService,
  FlEntityPaginatedDatasource,
  FlSavedSearch,
  FlSearchConfig,
  FlSearchState,
  FlThemeService,
} from '@monorepo/front-core-lib';
import {
  CaBucketFull,
  CaBucketFullDatasource,
} from '../../../../ca-core/model/entities/ca-object-storage.class';
import {
  CaBucketSearch,
  CaBucketSearchFields,
} from '../../../../ca-core/entity-module/ca-object-storage-core/model/ca-bucket-search.class';
import { CaObjectStorageService } from '../../../../ca-core/service-api/ca-object-storage.service';
import {
  CaBucketFormDialogComponent,
  CaBucketFormDialogInput,
} from '../ca-bucket-form-dialog/ca-bucket-form-dialog.component';

@Component({
    selector: 'ca-bucket-search',
    templateUrl: './ca-bucket-search.component.html',
    styleUrls: ['./ca-bucket-search.component.scss'],
    providers: [FlSearchState],
    standalone: false
})
export class CaBucketSearchComponent implements OnInit {
  datasource: CaBucketFullDatasource<CaBucketSearchFields>;

  constructor(
    private searchState: FlSearchState<any>,
    private bucketSearch: CaObjectStorageService,
    private themeService: FlThemeService,
    private dialogService: FlDialogService
  ) {}

  ngOnInit(): void {
    const config: FlSearchConfig = {
      version: 1,
      buildAdvancedForm: CaBucketSearch.getSearchForm,
      advancedFormClass: CaBucketSearchFields,
      savedSearch: this.getSavedSearch(),
      advancedFormManager: {
        config: CaBucketSearch.searchManagerConfig,
        skipFalseBoolean: true,
      },
      storeSearchInUrl: true,
      defaultSort: { key: 'name', direction: 'ASC' },
    };

    this.datasource = new FlEntityPaginatedDatasource(
      (page, size, filters) => this.bucketSearch.searchBucket(page, size, filters),
      20,
      { initFirstPage: false }
    );
    this.searchState.init(config, this.datasource);
  }

  private getSavedSearch(): FlSavedSearch[] {
    return [
      {
        searchName: 'ca-bucket',
        id: null,
        label: 'All buckets',
        color: this.themeService.getCurrentThemeDetail().primary,
        version: 1,
        default: true,
        filtersCriteria: {} as Partial<CaBucketSearchFields>,
      },
    ];
  }

  openCreateDialog(): void {
    const input: CaBucketFormDialogInput = {
      mode: 'create',
    };

    this.dialogService
      .openSmallDialog(CaBucketFormDialogComponent, { data: input })
      .afterClosed()
      .subscribe((bucket) => this.onCreateClosed(bucket));
  }

  private onCreateClosed(bucket?: CaBucketFull): void {
    if (bucket) {
      this.datasource.addItem(bucket);
    }
  }
}
