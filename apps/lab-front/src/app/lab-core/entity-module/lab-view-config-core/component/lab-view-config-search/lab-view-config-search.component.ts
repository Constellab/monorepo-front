import { Component, EventEmitter, Input, OnInit, Output, inject } from '@angular/core';
import { FlEntityPaginatedDatasource } from '@monorepo/front-core-lib/fl-core';
import { FlSavedSearch } from '@monorepo/front-core-lib/fl-search';
import { FlSearchConfig } from '@monorepo/front-core-lib/fl-search';
import { FlSearchState } from '@monorepo/front-core-lib/fl-search';
import { FlTableColumnStatic } from '@monorepo/front-core-lib/fl-core';
import { FlTag } from '@monorepo/front-core-lib/fl-tag';
import { FlThemeService } from '@monorepo/front-core-lib/fl-theme';

import {
  LabViewConfig,
  LabViewConfigDatasource,
} from '../../../../model/entities/resource/lab-view-config.entity';
import { LabViewConfigSearch, LabViewConfigSearchFields } from '../../model/lab-view-config-search.class';
import { LabViewConfigService } from '../../../../entity-service/lab-view-config.service';
import { FlSearchModule } from '@monorepo/front-core-lib/fl-search';
import { LabViewConfigSearchFormComponent } from '../lab-view-config-search-form/lab-view-config-search-form.component';
import { FlTextIconModule } from '@monorepo/front-core-lib/fl-text-icon';
import { MatIcon } from '@angular/material/icon';
import { FlIconModule } from '@monorepo/front-core-lib/fl-svg-icon';
import { LabViewConfigTableComponent } from '../lab-view-config-table/lab-view-config-table.component';
import { TranslatePipe } from '@ngx-translate/core';

/**
 * Search on view config, only work for search linked to a note
 */
@Component({
  selector: 'lab-view-config-search',
  templateUrl: './lab-view-config-search.component.html',
  styleUrls: ['./lab-view-config-search.component.scss'],
  providers: [FlSearchState],
  imports: [
    FlSearchModule,
    LabViewConfigSearchFormComponent,
    FlTextIconModule,
    MatIcon,
    FlIconModule,
    LabViewConfigTableComponent,
    TranslatePipe,
  ],
})
export class LabViewConfigSearchComponent implements OnInit {
  private searchState = inject<FlSearchState<any>>(FlSearchState);
  private viewConfigService = inject(LabViewConfigService);
  private themeService = inject(FlThemeService);

  @Input() noteId: string;

  @Input() fullPageSearch: boolean = true;

  @Output() viewConfigSelected: EventEmitter<LabViewConfig> = new EventEmitter();

  datasource: LabViewConfigDatasource;

  columns: FlTableColumnStatic<LabViewConfig>[];

  ngOnInit(): void {
    const config: FlSearchConfig = {
      version: 1,
      buildAdvancedForm: LabViewConfigSearch.getSearchForm,
      advancedFormClass: LabViewConfigSearchFields,
      savedSearch: this.getSavedSearch(),
      advancedFormManager: {
        config: LabViewConfigSearch.searchManagerConfig,
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
        searchName: 'lab-view-config',
        id: 'favorite-views',
        label: 'Favorite views',
        color: this.themeService.getCurrentThemeDetail().primary,
        version: 1,
        default: true,
        filtersCriteria: {} as Partial<LabViewConfigSearchFields>,
      },
      {
        searchName: 'lab-view-config',
        id: 'all-views',
        label: 'All views',
        color: this.themeService.getCurrentThemeDetail().primary,
        version: 1,
        default: false,
        filtersCriteria: { includeNotFavorite: true } as Partial<LabViewConfigSearchFields>,
      },
    ];
  }

  selectViewConfig(viewConfig: LabViewConfig): void {
    this.viewConfigSelected.next(viewConfig);
  }

  searchOnTag(tag: FlTag): void {
    const tags = this.searchState.advancedSearchFormGroup.value.tags ?? [];
    const newTags = [...tags, tag];
    const search: Partial<LabViewConfigSearchFields> = {
      tags: newTags,
    };
    this.searchState.patchFormValueAndCallSearch(search);
  }
}
