import { ChangeDetectionStrategy,Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { FlEntityPaginatedDatasource, FlTableColumnStatic } from '@monorepo/front-core-lib/fl-core';
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
  LiViewConfig,
  LiViewConfigDatasource,
  LiViewConfigSearch,
  LiViewConfigSearchFields,
  LiViewConfigService,
} from '@monorepo/lab-lib/li-core';
import { TranslatePipe } from '@ngx-translate/core';

import { LiViewConfigSearchFormComponent } from '../li-view-config-search-form/li-view-config-search-form.component';
import { LiViewConfigTableComponent } from '../li-view-config-table/li-view-config-table.component';

/**
 * Search on view config, only work for search linked to a note
 */
@Component({
  selector: 'li-view-config-search',
  templateUrl: './li-view-config-search.component.html',
  styleUrls: ['./li-view-config-search.component.scss'],
  providers: [FlSearchState],
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    FlSearchModule,
    LiViewConfigSearchFormComponent,
    FlTextIconModule,
    MatIcon,
    FlIconModule,
    LiViewConfigTableComponent,
    TranslatePipe,
  ],
})
export class LiViewConfigSearchComponent implements OnInit {
  private searchState = inject<FlSearchState<any>>(FlSearchState);
  private viewConfigService = inject(LiViewConfigService);
  private themeService = inject(FlThemeService);

  @Input() noteId: string;

  @Input() fullPageSearch: boolean = true;

  @Output() viewConfigSelected: EventEmitter<LiViewConfig> = new EventEmitter();

  datasource: LiViewConfigDatasource;

  columns: FlTableColumnStatic<LiViewConfig>[];

  ngOnInit(): void {
    const config: FlSearchConfig = {
      version: 1,
      buildAdvancedForm: LiViewConfigSearch.getSearchForm,
      advancedFormClass: LiViewConfigSearchFields,
      savedSearch: this.getSavedSearch(),
      advancedFormManager: {
        config: LiViewConfigSearch.searchManagerConfig,
        skipFalseBoolean: true,
      },
      storeSearchInUrl: this.fullPageSearch,
      defaultSort: { key: 'lastModifiedAt', direction: 'DESC' },
    };

    this.datasource = new FlEntityPaginatedDatasource(
      this.viewConfigService.getViewConfigSearchFunction(this.noteId),
      20,
      { initFirstPage: false }
    );

    this.searchState.init(config, this.datasource);

    this.columns = ['title', 'resource', 'lastModifiedAt', 'tags', 'preview', 'isFavorite'];
    // add the action column only when the search is in full page (view box)
    if (this.fullPageSearch) {
      this.columns.push('action');
    }
  }

  private getSavedSearch(): FlSavedSearch[] {
    // list of predefined search of the resources
    return [
      {
        searchName: 'li-view-config',
        id: 'favorite-views',
        label: 'Favorite views',
        color: this.themeService.getCurrentThemeDetail().primary,
        version: 1,
        default: true,
        filtersCriteria: {} as Partial<LiViewConfigSearchFields>,
      },
      {
        searchName: 'li-view-config',
        id: 'all-views',
        label: 'All views',
        color: this.themeService.getCurrentThemeDetail().primary,
        version: 1,
        default: false,
        filtersCriteria: { includeNotFavorite: true } as Partial<LiViewConfigSearchFields>,
      },
    ];
  }

  selectViewConfig(viewConfig: LiViewConfig): void {
    this.viewConfigSelected.next(viewConfig);
  }

  searchOnTag(tag: FlTag): void {
    const tags = this.searchState.advancedSearchFormGroup.value.tags ?? [];
    const newTags = [...tags, tag];
    const search: Partial<LiViewConfigSearchFields> = {
      tags: newTags,
    };
    this.searchState.patchFormValueAndCallSearch(search);
  }
}
