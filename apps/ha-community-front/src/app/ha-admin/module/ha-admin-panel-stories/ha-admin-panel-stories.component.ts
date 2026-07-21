import { ChangeDetectionStrategy,Component, inject, OnInit } from '@angular/core';
import { MatAnchor, MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { FlCardModule } from '@monorepo/front-core-lib/fl-card';
import { FlEntityPaginatedDatasource } from '@monorepo/front-core-lib/fl-core';
import { FlLoaderModule } from '@monorepo/front-core-lib/fl-loader';
import {
  FlSavedSearch,
  FlSearchConfig,
  FlSearchModule,
  FlSearchState,
} from '@monorepo/front-core-lib/fl-search';
import { FlIconModule } from '@monorepo/front-core-lib/fl-svg-icon';
import { FlTextIconModule } from '@monorepo/front-core-lib/fl-text-icon';
import { FlThemeService } from '@monorepo/front-core-lib/fl-theme';
import { TranslatePipe } from '@ngx-translate/core';

import { HaStory, HaStoryDatasourcePaginated } from '../../../ha-core/ha-model/ha-entities/ha-story.class';
import { HaStoryService } from '../../../ha-core/ha-service/ha-story.service';
import {
  HaAdminPanelStorySearch,
  HaAdminPanelStorySearchFields,
} from '../../model/ha-admin-panel-story-search.class';

@Component({
  selector: 'ha-admin-panel-stories',
  imports: [
    FlLoaderModule,
    MatButton,
    FlCardModule,
    MatIcon,
    FlIconModule,
    TranslatePipe,
    FlSearchModule,
    FlTextIconModule,
    MatAnchor,
  ],
  providers: [FlSearchState],
  templateUrl: './ha-admin-panel-stories.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './ha-admin-panel-stories.component.scss',
})
export class HaAdminPanelStoriesComponent implements OnInit {
  private searchState = inject<FlSearchState<HaStory>>(FlSearchState);
  private storyService = inject(HaStoryService);
  private themeService = inject(FlThemeService);

  datasource: HaStoryDatasourcePaginated<HaAdminPanelStorySearchFields>;
  urlDownloadStoriesZip: string = this.storyService.urlToDownloadStoriesZip();

  ngOnInit(): void {
    const config: FlSearchConfig = {
      version: 1,
      buildAdvancedForm: HaAdminPanelStorySearch.getSearchForm,
      advancedFormClass: HaAdminPanelStorySearchFields,
      savedSearch: this.getSavedSearch(),
      advancedFormManager: {
        config: HaAdminPanelStorySearch.searchManagerConfig,
      },
      storeSearchInUrl: true,
      defaultSort: { key: 'created', direction: 'DESC' },
    };

    this.datasource = new FlEntityPaginatedDatasource(
      (page, size, filters) => this.storyService.search(page, size, filters),
      20,
      { initFirstPage: false }
    );
    this.searchState.init(config, this.datasource);
  }

  private getSavedSearch(): FlSavedSearch[] {
    return [
      {
        searchName: 'ha-story',
        id: null,
        label: 'All stories',
        color: this.themeService.getCurrentThemeDetail().primary,
        version: 1,
        default: true,
        filtersCriteria: {} as Partial<HaAdminPanelStorySearchFields>,
      },
    ];
  }
}
