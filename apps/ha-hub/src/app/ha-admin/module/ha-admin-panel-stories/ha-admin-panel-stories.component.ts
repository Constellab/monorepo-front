import { Component, inject, OnInit } from '@angular/core';
import { FlCardModule } from '@monorepo/front-core-lib/fl-card';
import {
  FlSavedSearch,
  FlSearchConfig,
  FlSearchModule,
  FlSearchState,
} from '@monorepo/front-core-lib/fl-search';
import { FlTextIconModule } from '@monorepo/front-core-lib/fl-text-icon';
import { TranslatePipe } from '@ngx-translate/core';
import { MatAnchor, MatButton } from '@angular/material/button';
import { HaStoryService } from '../../../ha-core/ha-service/ha-story.service';
import { FlDialogService } from '@monorepo/front-core-lib/fl-dialog';
import {
  HaAdminSendToDifyDialogComponent,
  HaAdminSendToDifyDialogInput,
} from '../ha-admin-send-brick-docs-to-dify-dialog/ha-admin-send-to-dify-dialog.component';
import { HaEntityType } from '../../../ha-core/ha-model/ha-entities/ha-entity-type';
import { MatIcon } from '@angular/material/icon';
import { HaStory, HaStoryDatasourcePaginated } from '../../../ha-core/ha-model/ha-entities/ha-story.class';
import {
  HaAdminPanelStorySearch,
  HaAdminPanelStorySearchFields,
} from '../../model/ha-admin-panel-story-search.class';
import { FlThemeService } from '@monorepo/front-core-lib/fl-theme';
import { FlEntityPaginatedDatasource } from '@monorepo/front-core-lib/fl-core';
import { FlLoaderModule } from '@monorepo/front-core-lib/fl-loader';
import { FlIconModule } from '@monorepo/front-core-lib/fl-svg-icon';

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
  styleUrl: './ha-admin-panel-stories.component.scss',
})
export class HaAdminPanelStoriesComponent implements OnInit {
  private searchState = inject<FlSearchState<HaStory>>(FlSearchState);
  private storyService = inject(HaStoryService);
  private dialogService = inject(FlDialogService);
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

  sendStoriesToDify(): void {
    const data: HaAdminSendToDifyDialogInput = {
      entityType: HaEntityType.STORY,
    };

    this.dialogService.openSmallDialog(HaAdminSendToDifyDialogComponent, { data: data });
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
