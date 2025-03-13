import { Component, inject, OnInit } from '@angular/core';
import { FlLoaderModule } from '@monorepo/front-core-lib/fl-loader';
import { MatButton } from '@angular/material/button';
import { HaBrickVersionService } from '../../../ha-core/ha-service/ha-brick-version.service';
import { FlCardModule } from '@monorepo/front-core-lib/fl-card';
import { MatIcon } from '@angular/material/icon';
import { FlIconModule } from '@monorepo/front-core-lib/fl-svg-icon';
import { TranslatePipe } from '@ngx-translate/core';
import {
  FlSavedSearch,
  FlSearchConfig,
  FlSearchModule,
  FlSearchState,
} from '@monorepo/front-core-lib/fl-search';
import { FlTextIconModule } from '@monorepo/front-core-lib/fl-text-icon';
import { HaAdminPanelBricksSearchFormComponent } from '../ha-admin-panel-bricks-search-form/ha-admin-panel-bricks-search-form.component';
import {
  HaAdminPanelBricksTableActionEvent,
  HaAdminPanelBricksTableComponent,
} from '../ha-admin-panel-bricks-table/ha-admin-panel-bricks-table.component';
import {
  HaAdminPanelBrickSearch,
  HaAdminPanelBrickSearchFields,
} from '../../model/ha-admin-panel-brick-search.class';
import { FlThemeService } from '@monorepo/front-core-lib/fl-theme';
import { HaBrick, HaBrickDatasourcePaginated } from '../../../ha-core/ha-model/ha-entities/ha-brick.class';
import { FlEntityPaginatedDatasource } from '@monorepo/front-core-lib/fl-core';
import { HaBrickService } from '../../../ha-core/ha-service/ha-brick.service';
import { FlDialogService } from '@monorepo/front-core-lib/fl-dialog';
import {
  HaAdminSendToDifyDialogComponent,
  HaAdminSendToDifyDialogInput,
} from '../ha-admin-send-brick-docs-to-dify-dialog/ha-admin-send-to-dify-dialog.component';
import { DOCUMENT } from '@angular/common';
import { HaEntityType } from '../../../ha-core/ha-model/ha-entities/ha-entity-type';

@Component({
  selector: 'ha-admin-panel-bricks',
  imports: [
    FlLoaderModule,
    MatButton,
    FlCardModule,
    MatIcon,
    FlIconModule,
    TranslatePipe,
    FlSearchModule,
    FlTextIconModule,
    HaAdminPanelBricksSearchFormComponent,
    HaAdminPanelBricksTableComponent,
  ],
  providers: [FlSearchState],
  templateUrl: './ha-admin-panel-bricks.component.html',
  styleUrl: './ha-admin-panel-bricks.component.scss',
})
export class HaAdminPanelBricksComponent implements OnInit {
  private searchState = inject<FlSearchState<HaBrick>>(FlSearchState);
  private brickService = inject(HaBrickService);
  private brickVersionService = inject(HaBrickVersionService);
  private themeService = inject(FlThemeService);

  private dialogService = inject(FlDialogService);

  private document = inject(DOCUMENT);

  datasource: HaBrickDatasourcePaginated<HaAdminPanelBrickSearchFields>;

  isLoading: boolean = false;

  ngOnInit(): void {
    const config: FlSearchConfig = {
      version: 1,
      buildAdvancedForm: HaAdminPanelBrickSearch.getSearchForm,
      advancedFormClass: HaAdminPanelBrickSearchFields,
      savedSearch: this.getSavedSearch(),
      advancedFormManager: {
        config: HaAdminPanelBrickSearch.searchManagerConfig,
      },
      storeSearchInUrl: true,
      defaultSort: { key: 'created', direction: 'DESC' },
    };

    this.datasource = new FlEntityPaginatedDatasource(
      (page, size, filters) => this.brickService.search(page, size, filters),
      20,
      { initFirstPage: false }
    );
    this.searchState.init(config, this.datasource);
  }

  sendAllToQueue(): void {
    this.isLoading = true;
    this.brickVersionService.sendAllBrickVersion().subscribe(() => {
      this.isLoading = false;
    });
  }

  onAction(actionEvent: HaAdminPanelBricksTableActionEvent): void {
    switch (actionEvent.type) {
      case 'download_docs':
        this.urlToDownloadDocsZipPrefix(actionEvent.brick.id);
        break;
      case 'send_docs_to_dify':
        this.openAdminSendBrickDocsToDifyDialog(actionEvent.brick);
        break;
    }
  }

  private urlToDownloadDocsZipPrefix(brickId: string): void {
    const zipFileUrl = this.brickService.urlToDownloadDocsZipPrefix() + brickId;
    //create a element to download the file
    const link = document.createElement('a');
    link.href = zipFileUrl;
    link.download = '';
    //add the element to the body
    this.document.body.appendChild(link);
    //click the element
    link.click();
    //remove the element
    this.document.body.removeChild(link);
  }

  private openAdminSendBrickDocsToDifyDialog(brick: HaBrick): void {
    const data: HaAdminSendToDifyDialogInput = {
      entityType: HaEntityType.BRICK,
      entityId: brick.id,
    };
    this.dialogService.openSmallDialog(HaAdminSendToDifyDialogComponent, { data: data });
  }

  private getSavedSearch(): FlSavedSearch[] {
    return [
      {
        searchName: 'ha-brick',
        id: null,
        label: 'All bricks',
        color: this.themeService.getCurrentThemeDetail().primary,
        version: 1,
        default: true,
        filtersCriteria: {} as Partial<HaAdminPanelBrickSearchFields>,
      },
    ];
  }
}
