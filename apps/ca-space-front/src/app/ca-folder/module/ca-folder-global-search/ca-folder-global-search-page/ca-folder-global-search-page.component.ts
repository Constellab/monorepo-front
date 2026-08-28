import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { FlCardModule } from '@monorepo/front-core-lib/fl-card';
import { FlTableColumnStatic } from '@monorepo/front-core-lib/fl-core';
import { FlInfiniteScrollModule } from '@monorepo/front-core-lib/fl-infinite-scroll';
import { FlIconModule } from '@monorepo/front-core-lib/fl-svg-icon';
import { FlTextIconModule } from '@monorepo/front-core-lib/fl-text-icon';
import { TranslatePipe } from '@ngx-translate/core';

import { CaHierarchyObjectSearchFields } from '../../../../ca-core/entity-module/ca-hierarchy-object-core/ca-hierarchy-object-search.class';
import {
  CaHierarchyObjectTableComponent,
  CaHierarchyObjectTableEvent,
} from '../../../../ca-core/entity-module/ca-hierarchy-object-core/component/ca-hierarchy-object-table/ca-hierarchy-object-table.component';
import {
  CaHierarchyObject,
  CaHierarchyObjectDatasource,
} from '../../../../ca-core/model/entities/folder/ca-hierarchy-object.class';
import { CaHierarchyObjectActionsMenuComponent } from '../../ca-folder-hierarchy-core/component/ca-hierarchy-object-actions-menu/ca-hierarchy-object-actions-menu.component';
import { CaHierarchyObjectActionsMenuState } from '../../ca-folder-hierarchy-core/state/ca-hierarchy-object-actions-menu.state';
import { CaHierarchyObjectDetailState } from '../../ca-folder-hierarchy-core/state/ca-hierarchy-object-detail.state';
import { CaHierarchyObjectSearchState } from '../../ca-folder-hierarchy-core/state/ca-hierarchy-object-search.state';
import { CaHierarchyObjectSearchFormComponent } from '../../ca-hierarchy-object-detail-page/ca-hierarchy-object-search-form/ca-hierarchy-object-search-form.component';

@Component({
  selector: 'ca-folder-global-search-page',
  imports: [
    CaHierarchyObjectSearchFormComponent,
    CaHierarchyObjectTableComponent,
    FlCardModule,
    FlIconModule,
    FlInfiniteScrollModule,
    FlTextIconModule,
    TranslatePipe,
    CaHierarchyObjectActionsMenuComponent,
    MatIcon,
    AsyncPipe,
  ],
  templateUrl: './ca-folder-global-search-page.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './ca-folder-global-search-page.component.scss',
})
export class CaFolderGlobalSearchPageComponent implements OnInit {
  private searchState = inject(CaHierarchyObjectSearchState);
  private actionsMenuState = inject(CaHierarchyObjectActionsMenuState);

  children: CaHierarchyObjectDatasource<CaHierarchyObjectSearchFields>;

  columns: FlTableColumnStatic<CaHierarchyObject>[] = [
    'name',
    'user',
    'lastModifiedAt',
    'tags',
    'parent',
    'customAction',
  ];

  hierarchyObjectContext$ = inject(CaHierarchyObjectDetailState).getHierarchyContext$();

  ngOnInit(): void {
    this.children = this.searchState.childrenDatasource;
  }

  onHierarchyObjectRowEvent(event: CaHierarchyObjectTableEvent): void {
    switch (event.action) {
      case 'click':
        this.actionsMenuState.onHierarchyObjectClicked(event.hierarchyObject);
        break;
      case 'dblClick':
        this.actionsMenuState.onHierarchyObjectDblClicked(event.hierarchyObject);
        break;
      case 'rightClick':
        this.actionsMenuState.openHierarchyObjectActionMenu(event.hierarchyObject, event.event).then();
        break;
      case 'middleClick':
        this.actionsMenuState.onHierarchyObjectMiddleClicked(event.hierarchyObject);
        break;
    }
  }
}
