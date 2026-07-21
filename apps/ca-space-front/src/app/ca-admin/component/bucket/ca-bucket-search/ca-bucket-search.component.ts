import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatTooltip } from '@angular/material/tooltip';
import { FlCardModule } from '@monorepo/front-core-lib/fl-card';
import { FlEntityPaginatedDatasource } from '@monorepo/front-core-lib/fl-core';
import { FlDialogService } from '@monorepo/front-core-lib/fl-dialog';
import {
  FlSavedSearch,
  FlSearchConfig,
  FlSearchModule,
  FlSearchState,
} from '@monorepo/front-core-lib/fl-search';
import { FlTextIconModule } from '@monorepo/front-core-lib/fl-text-icon';
import { FlThemeService } from '@monorepo/front-core-lib/fl-theme';
import { TranslatePipe } from '@ngx-translate/core';

import {
  CaBucketSearch,
  CaBucketSearchFields,
} from '../../../../ca-core/entity-module/ca-object-storage-core/model/ca-bucket-search.class';
import {
  CaBucketFull,
  CaBucketFullDatasource,
} from '../../../../ca-core/model/entities/ca-object-storage.class';
import { CaObjectStorageService } from '../../../../ca-core/service-api/ca-object-storage.service';
import {
  CaBucketFormDialogComponent,
  CaBucketFormDialogInput,
} from '../ca-bucket-form-dialog/ca-bucket-form-dialog.component';
import { CaBucketSearchFormComponent } from '../ca-bucket-search-form/ca-bucket-search-form.component';
import { CaBucketTableComponent } from '../ca-bucket-table/ca-bucket-table.component';

@Component({
  selector: 'ca-bucket-search',
  templateUrl: './ca-bucket-search.component.html',
  styleUrls: ['./ca-bucket-search.component.scss'],
  providers: [FlSearchState],
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    FlCardModule,
    FlSearchModule,
    FlTextIconModule,
    MatIcon,
    MatIconButton,
    MatTooltip,
    CaBucketSearchFormComponent,
    CaBucketTableComponent,
    TranslatePipe,
  ],
})
export class CaBucketSearchComponent implements OnInit {
  private searchState = inject<FlSearchState<any>>(FlSearchState);
  private bucketSearch = inject(CaObjectStorageService);
  private themeService = inject(FlThemeService);
  private dialogService = inject(FlDialogService);

  datasource: CaBucketFullDatasource<CaBucketSearchFields>;

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
