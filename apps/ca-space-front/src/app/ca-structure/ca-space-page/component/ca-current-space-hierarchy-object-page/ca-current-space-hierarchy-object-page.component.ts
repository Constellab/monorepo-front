import { Component, inject, Injector, OnInit } from '@angular/core';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { ClHelpService } from '@monorepo/core-lib';
import { FlCardModule } from '@monorepo/front-core-lib/fl-card';
import { FlEntityPaginatedDatasource, FlTableColumnStatic } from '@monorepo/front-core-lib/fl-core';
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

import { CaHierarchyObjectRouterService } from '../../../../ca-core/entity-module/ca-hierarchy-object-core/ca-hierarchy-object-router.service';
import {
  CaHierarchyObjectAdminSearchFields,
  CaHierarchyObjectSearch,
} from '../../../../ca-core/entity-module/ca-hierarchy-object-core/ca-hierarchy-object-search.class';
import { CaHierarchyObjectAdminSearchFormComponent } from '../../../../ca-core/entity-module/ca-hierarchy-object-core/component/ca-hierarchy-object-admin-search-form/ca-hierarchy-object-admin-search-form.component';
import {
  CaHierarchyObjectTableComponent,
  CaHierarchyObjectTableEvent,
} from '../../../../ca-core/entity-module/ca-hierarchy-object-core/component/ca-hierarchy-object-table/ca-hierarchy-object-table.component';
import {
  CaHierarchyObject,
  CaHierarchyObjectDatasource,
} from '../../../../ca-core/model/entities/folder/ca-hierarchy-object.class';
import { CaHierarchyObjectService } from '../../../../ca-core/service-api/ca-hierarchy-object.service';
import {
  CaHierarchyObjectBaseActionMenu,
  CaHierarchyObjectMoveToTrashAction,
  CaHierarchyObjectRestoreFromTrashAction,
} from '../../../../ca-folder/module/ca-folder-detail-page/ca-hierarchy-object-base-action-menu';

@Component({
  selector: 'ca-current-space-hierarchy-object-page',
  templateUrl: './ca-current-space-hierarchy-object-page.component.html',
  styleUrls: ['./ca-current-space-hierarchy-object-page.component.scss'],
  imports: [
    CaHierarchyObjectAdminSearchFormComponent,
    CaHierarchyObjectTableComponent,
    FlCardModule,
    FlIconModule,
    FlSearchModule,
    FlTextIconModule,
    MatIcon,
    TranslatePipe,
    MatIconButton,
  ],
  providers: [FlSearchState],
})
export class CaCurrentSpaceHierarchyObjectPageComponent implements OnInit {
  private searchState = inject<FlSearchState<any>>(FlSearchState);
  private hierarchyObjectService = inject(CaHierarchyObjectService);
  private themeService = inject(FlThemeService);
  private hierarchyObjectRouterService = inject(CaHierarchyObjectRouterService);
  private injector = inject(Injector);

  datasource: CaHierarchyObjectDatasource<CaHierarchyObjectAdminSearchFields>;

  columns: FlTableColumnStatic<CaHierarchyObject>[] = [
    'name',
    'user',
    'lastModifiedAt',
    'tags',
    'statusIcons',
    'customAction',
  ];

  ngOnInit(): void {
    const config: FlSearchConfig = {
      version: 1,
      buildAdvancedForm: CaHierarchyObjectSearch.getAdminSearchForm,
      advancedFormClass: CaHierarchyObjectAdminSearchFields,
      savedSearch: this.getSavedSearch(),
      advancedFormManager: {
        config: CaHierarchyObjectSearch.searchAdminManagerConfig(),
        skipFalseBoolean: true,
      },
      storeSearchInUrl: true,
      defaultSort: { key: 'name', direction: 'ASC' },
    };

    this.datasource = new FlEntityPaginatedDatasource(
      (page, size, data) => this.hierarchyObjectService.searchInCurrentSpace(page, size, data),
      20,
      { initFirstPage: false }
    );
    this.searchState.init(config, this.datasource);
  }

  private getSavedSearch(): FlSavedSearch[] {
    return [
      {
        searchName: 'ca-hierarchy-object-admin',
        id: null,
        label: 'All objects',
        color: this.themeService.getCurrentThemeDetail().primary,
        version: 1,
        default: true,
        filtersCriteria: {} as Partial<CaHierarchyObjectAdminSearchFields>,
      },
    ];
  }

  navigateToObject(event: CaHierarchyObjectTableEvent): void {
    switch (event.action) {
      case 'click':
      case 'dblClick':
        this.hierarchyObjectRouterService.navigateToHierarchyObject(event.hierarchyObject);
        break;
      case 'middleClick':
        this.hierarchyObjectRouterService.openHierarchyObjectInNewTab(event.hierarchyObject);
        break;
    }
  }

  public openHierarchyObjectActionMenu(hierarchyObject: CaHierarchyObject, event: MouseEvent): void {
    ClHelpService.stopEventPropagation(event);
    const service = new CaHierarchyObjectBaseActionMenu(this.injector, hierarchyObject.id);
    service
      .openTrashRestoreMenu(event, hierarchyObject)
      .subscribe((hierarchyObjectActionEvent) => this.onMenuEvent(hierarchyObjectActionEvent));
  }

  private onMenuEvent(
    event: CaHierarchyObjectMoveToTrashAction | CaHierarchyObjectRestoreFromTrashAction | null
  ): void {
    if (event == null) return;
    this.datasource.updateItem(event.hierarchyObject);
  }
}
