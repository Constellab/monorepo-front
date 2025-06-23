import { Component, inject, Input, input, OnInit, output } from '@angular/core';
import {
  FlSavedSearch,
  FlSearchConfig,
  FlSearchModule,
  FlSearchState,
} from '@monorepo/front-core-lib/fl-search';
import {
  LiRouterService,
  LiTagKeyModel,
  LiTagKeyModelDatasource,
  LiTagSearch,
  LiTagSearchFields,
  LiTagService,
  LiTagsNotSynchronized,
} from '@monorepo/lab-lib/li-core';
import { FlDialogService } from '@monorepo/front-core-lib/fl-dialog';
import { FlThemeService } from '@monorepo/front-core-lib/fl-theme';
import { FlTableColumnStatic } from '@monorepo/front-core-lib/fl-core';
import { FlTextIconModule } from '@monorepo/front-core-lib/fl-text-icon';
import { TranslatePipe } from '@ngx-translate/core';
import { MatIconButton } from '@angular/material/button';
import { MatTooltip } from '@angular/material/tooltip';
import { MatIcon } from '@angular/material/icon';
import { LiTagTableComponent } from '../li-tag-table/li-tag-table.component';
import { FlIconModule } from '@monorepo/front-core-lib/fl-svg-icon';
import { LiTagSearchFormComponent } from '../li-tag-search-form/li-tag-search-form.component';
import { LiSyncImportedCommunityTagsDialogComponent } from '../li-sync-imported-community-tags-dialog/li-sync-imported-community-tags-dialog.component';
import { FlPortalAction, FlPortalActionsService } from '@monorepo/front-core-lib/fl-portal-actions';
import { LiTagCreateDialogComponent } from '../li-tag-create-dialog/li-tag-create-dialog.component';
import { Router } from '@angular/router';

@Component({
  selector: 'li-tag-search',
  imports: [
    FlSearchModule,
    FlTextIconModule,
    TranslatePipe,
    MatIconButton,
    MatTooltip,
    MatIcon,
    LiTagTableComponent,
    FlIconModule,
    LiTagSearchFormComponent,
  ],
  templateUrl: './li-tag-search.component.html',
  styleUrl: './li-tag-search.component.scss',
  providers: [FlSearchState],
})
export class LiTagSearchComponent implements OnInit {
  private searchState = inject<FlSearchState<any>>(FlSearchState);
  private tagService = inject(LiTagService);
  private dialogService = inject(FlDialogService);
  private themeService = inject(FlThemeService);
  private actionService = inject(FlPortalActionsService);
  private router = inject(Router);

  fullPageSearch = input<boolean>(true);

  @Input() columns: FlTableColumnStatic<LiTagKeyModel>[] = ['key', 'label', 'valueFormat'];

  tagSelected = output<LiTagKeyModel>();

  datasource: LiTagKeyModelDatasource<LiTagSearchFields>;

  ngOnInit(): void {
    const config: FlSearchConfig = {
      version: 1,
      buildAdvancedForm: LiTagSearch.getSearchForm,
      advancedFormClass: LiTagSearchFields,
      savedSearch: this.getSavedSearch(),
      advancedFormManager: {
        config: LiTagSearch.searchManagerConfig,
        skipFalseBoolean: true,
      },
      storeSearchInUrl: this.fullPageSearch(),
      defaultSort: { key: 'creation', direction: 'DESC' },
    };

    this.datasource = this.tagService.getSearchDatasource();
    this.searchState.init(config, this.datasource);

    if (this.fullPageSearch()) {
      this.columns.push('actions');
    }
  }

  openCreateDialog(): void {
    this.dialogService
      .openSmallDialog(LiTagCreateDialogComponent, {})
      .afterClosed()
      .subscribe((result: LiTagKeyModel) => {
        if (result) {
          this.router.navigate([LiRouterService.getTagDetailRoute(result.key)]);
        }
      });
  }

  onTagSelected(tag: LiTagKeyModel): void {
    this.tagSelected.emit(tag);
  }

  syncImportedCommunityTags(): void {
    this.dialogService
      .openMediumDialog(LiSyncImportedCommunityTagsDialogComponent)
      .afterClosed()
      .subscribe((result: LiTagsNotSynchronized) => {
        if (result) {
          const action: FlPortalAction = {
            type: 'sync-community-tags',
            action: this.tagService.synchronizeCommunityTags(result),
            text: {
              text: 'li.synchronization_community_tags',
              translateText: true,
            },
          };
          this.actionService.addAction(action, true);
        }
      });
  }

  private getSavedSearch(): FlSavedSearch[] {
    return [
      {
        searchName: 'li-tag',
        id: 'current-tags',
        label: 'Current tags',
        color: this.themeService.getCurrentThemeDetail().primary,
        version: 1,
        default: true,
        filtersCriteria: {} as Partial<LiTagSearchFields>,
      },
      {
        searchName: 'li-tag',
        id: 'all-tags',
        label: 'All tags',
        color: this.themeService.getCurrentThemeDetail().primary,
        version: 1,
        default: false,
        filtersCriteria: { deprecated: true } as Partial<LiTagSearchFields>,
      },
    ];
  }
}
