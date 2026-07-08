import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import {
  FlDatasourcePaginated,
  FlEntityPaginatedDatasource,
  FlTableColumnStatic,
} from '@monorepo/front-core-lib/fl-core';
import { FlDragModule } from '@monorepo/front-core-lib/fl-drag';
import { FlInputFileModule } from '@monorepo/front-core-lib/fl-input-file';
import {
  FlSavedSearch,
  FlSearchConfig,
  FlSearchModule,
  FlSearchState,
} from '@monorepo/front-core-lib/fl-search';
import { FlIconModule } from '@monorepo/front-core-lib/fl-svg-icon';
import { FlTag } from '@monorepo/front-core-lib/fl-tag';
import { FlTextIconModule } from '@monorepo/front-core-lib/fl-text-icon';
import { FlThemeService } from '@monorepo/front-core-lib/fl-theme';
import {
  LiResource,
  LiResourceSearch,
  LiResourceSearchFields,
  LiResourceService,
} from '@monorepo/lab-lib/li-core';
import { TranslatePipe } from '@ngx-translate/core';
import { Subscription } from 'rxjs';

import { LiResourceSearchFormComponent } from '../li-resource-search-form/li-resource-search-form.component';
import { LiResourceTableComponent } from '../li-resource-table/li-resource-table.component';

export const LI_APP_SEARCH_NAME: string = 'li-app';

@Component({
  selector: 'li-app-search',
  templateUrl: './li-app-search.component.html',
  styleUrl: './li-app-search.component.scss',
  providers: [FlSearchState],
  imports: [
    FlSearchModule,
    FlDragModule,
    LiResourceSearchFormComponent,
    FlTextIconModule,
    MatIcon,
    FlIconModule,
    FlInputFileModule,
    LiResourceTableComponent,
    TranslatePipe,
  ],
})
export class LiAppSearchComponent implements OnInit, OnDestroy {
  datasource: FlDatasourcePaginated<LiResource>;

  columns: FlTableColumnStatic<LiResource>[] = [
    'name',
    'type',
    'tags',
    'lastModification',
    'viewResource',
    'flagged',
    'action',
  ];

  private actionSubscription: Subscription;

  private searchState = inject(FlSearchState);
  private resourceService = inject(LiResourceService);
  private themeService = inject(FlThemeService);

  ngOnInit(): void {
    const searchConfig: FlSearchConfig = {
      version: 1,
      buildAdvancedForm: LiResourceSearch.getSearchForm,
      advancedFormClass: LiResourceSearchFields,
      savedSearch: this.getSavedSearch(),
      advancedFormManager: {
        config: LiResourceSearch.searchManagerConfig,
        skipFalseBoolean: true,
      },
      storeSearchInUrl: true,
      defaultSort: { key: 'creation', direction: 'DESC' },
    };

    this.datasource = new FlEntityPaginatedDatasource(
      (page: number, pageSize: number, data: any) => this.resourceService.appSearch(page, pageSize, data),
      20,
      {
        initFirstPage: false,
      }
    );

    this.searchState.init(searchConfig, this.datasource);
  }

  searchOnTag(tag: FlTag): void {
    const tags = this.searchState.advancedSearchFormGroup.value.tags ?? [];
    const newTags = [...tags, tag];
    const search: Partial<LiResourceSearchFields> = {
      tags: newTags,
    };
    this.searchState.patchFormValueAndCallSearch(search);
  }

  private getSavedSearch(): FlSavedSearch[] {
    // list of predefined search of the resources
    return [
      {
        searchName: LI_APP_SEARCH_NAME,
        id: 'flagged-apps',
        label: 'Flagged apps',
        color: this.themeService.getCurrentThemeDetail().primary,
        version: 1,
        default: true,
        filtersCriteria: {} as Partial<LiResourceSearchFields>,
      },
      {
        searchName: LI_APP_SEARCH_NAME,
        id: 'all-apps',
        label: 'All apps',
        color: this.themeService.getCurrentThemeDetail().primary,
        version: 1,
        default: false,
        filtersCriteria: { includeNotFlagged: true } as Partial<LiResourceSearchFields>,
      },
    ];
  }

  ngOnDestroy(): void {
    this.actionSubscription?.unsubscribe();
  }
}
