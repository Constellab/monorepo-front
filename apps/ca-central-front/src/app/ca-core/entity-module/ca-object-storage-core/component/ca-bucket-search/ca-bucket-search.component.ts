import {Component, OnInit} from '@angular/core';
import {
  FlDialogService,
  FlEntityPaginatedDatasource,
  FlSavedSearch,
  FlSearchConfig,
  FlSearchState,
  FlTableColumnStatic,
  FlThemeService
} from '@monorepo/front-core-lib';
import {CaBucketFull, CaBucketFullDatasource} from '../../../../model/entities/ca-object-storage.class';
import {CaBucketSearch, CaBucketSearchFields} from '../../model/ca-bucket-search.class';
import {CaObjectStorageService} from '../../../../service-api/ca-object-storage.service';
import {
  CaBucketFormDialogComponent,
  CaBucketFormDialogInput
} from '../ca-bucket-form-dialog/ca-bucket-form-dialog.component';

@Component({
  selector: 'ca-bucket-search',
  templateUrl: './ca-bucket-search.component.html',
  styleUrls: ['./ca-bucket-search.component.scss'],
  providers: [FlSearchState]
})
export class CaBucketSearchComponent implements OnInit {

  datasource: CaBucketFullDatasource;

  columns: FlTableColumnStatic<CaBucketFull>[] =
    ['name', 'contentType', 'region', 'credentials', 'lastModified', 'actions'];

  constructor(private searchState: FlSearchState<any>,
              private bucketSearch: CaObjectStorageService,
              private themeService: FlThemeService,
              private dialogService: FlDialogService) {
  }

  ngOnInit(): void {
    const config: FlSearchConfig = {
      version: 1,
      buildAdvancedForm: CaBucketSearch.getAdvancedSearchForm,
      advancedFormClass: CaBucketSearchFields,
      savedSearch: this.getSavedSearch(),
      advancedFormManager: {
        config: CaBucketSearch.advancedSearchManagerConfig,
        skipFalseBoolean: true
      },
      storeSearchInUrl: true
    };

    this.datasource = new FlEntityPaginatedDatasource(
      (page, size, filters) => this.bucketSearch.searchBucket(page, size, filters),
      20, false);
    this.searchState.init(config, this.datasource);
  }

  private getSavedSearch(): FlSavedSearch[] {
    return [{
      searchName: 'ca-bucket',
      id: null,
      label: 'All buckets',
      color: this.themeService.getCurrentThemeDetail().primary,
      version: 1,
      default: true,
      filtersCriteria: {} as Partial<CaBucketSearchFields>
    }];
  }

  openCreateDialog(): void {
    const input: CaBucketFormDialogInput = {
      mode: 'create',
    };

    this.dialogService.openSmallDialog(CaBucketFormDialogComponent, {data: input}).afterClosed().subscribe(
      bucket => this.onCreateClosed(bucket)
    );
  }

  private onCreateClosed(bucket?: CaBucketFull): void {
    if (bucket) {
      this.datasource.addItem(bucket);
    }
  }

}
