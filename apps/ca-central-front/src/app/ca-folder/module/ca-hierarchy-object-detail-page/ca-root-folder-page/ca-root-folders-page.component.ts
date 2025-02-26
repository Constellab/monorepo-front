import { Component, inject, Injector, OnInit } from '@angular/core';
import { CaHierarchyObjectBreadcrumbComponent } from '../../ca-folder-hierarchy-core/component/ca-hierarchy-object-breadcrumb/ca-hierarchy-object-breadcrumb.component';
import { CaHierarchyObjectTableComponent } from '../../../../ca-core/entity-module/ca-hierarchy-object-core/component/ca-hierarchy-object-table/ca-hierarchy-object-table.component';
import { FlCardModule } from '@monorepo/front-core-lib/fl-card';
import { FlInfiniteScrollModule } from '@monorepo/front-core-lib/fl-infinite-scroll';
import {
  CaHierarchyObject,
  CaHierarchyObjectDatasource,
} from '../../../../ca-core/model/entities/folder/ca-hierarchy-object.class';
import { FlTableColumnStatic } from '@monorepo/front-core-lib/fl-core';
import { FlTextIconModule } from '@monorepo/front-core-lib/fl-text-icon';
import { FlIconModule } from '@monorepo/front-core-lib/fl-svg-icon';
import { TranslatePipe } from '@ngx-translate/core';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { CaFolderWithHierarchy } from '../../../../ca-core/model/entities/folder/ca-folder.class';
import { CaHierarchyObjectDetailState } from '../../ca-folder-hierarchy-core/state/ca-hierarchy-object-detail.state';
import { CaFolderActionService } from '../../../../ca-core/entity-module/ca-folder-core/ca-folder-action.service';
import {
  CaFolderActionEvent,
  CaFolderActionsMenu,
} from '../../../../ca-core/entity-module/ca-folder-core/model/ca-folder-actions-menu.class';
import { ClHelpService } from '@monorepo/core-lib';
import { CaHierarchyObjectSearchState } from '../../ca-folder-hierarchy-core/state/ca-hierarchy-object-search.state';
import { CaHierarchyObjectSearchFields } from '../../../../ca-core/entity-module/ca-hierarchy-object-core/model/ca-hierarchy-object-search.class';
import { CaHierarchyObjectSearchFormComponent } from '../../ca-folder-detail-page/component/ca-hierarchy-object-search-form/ca-hierarchy-object-search-form.component';

@Component({
  selector: 'ca-root-folder-page',
  imports: [
    CaHierarchyObjectBreadcrumbComponent,
    CaHierarchyObjectTableComponent,
    FlCardModule,
    FlInfiniteScrollModule,
    FlTextIconModule,
    FlIconModule,
    TranslatePipe,
    MatButton,
    MatIcon,
    MatIconButton,
    CaHierarchyObjectSearchFormComponent,
  ],
  templateUrl: './ca-root-folders-page.component.html',
  styleUrl: './ca-root-folders-page.component.scss',
})
export class CaRootFoldersPageComponent implements OnInit {
  children: CaHierarchyObjectDatasource<CaHierarchyObjectSearchFields>;

  columns: FlTableColumnStatic<CaHierarchyObject>[] = [
    'name',
    'user',
    'lastModifiedAt',
    'tags',
    'customAction',
  ];

  private state = inject(CaHierarchyObjectDetailState);
  private searchState = inject(CaHierarchyObjectSearchState);

  private folderActionService = inject(CaFolderActionService);
  private injector = inject(Injector);

  ngOnInit(): void {
    this.children = this.searchState.childrenDatasource;
  }

  openCreateFolderDialog(): void {
    this.folderActionService
      .openCreateRootFolderDialog()
      .subscribe((folders) => this.onCreateFolderClosed(folders));
  }

  private onCreateFolderClosed(folder?: CaFolderWithHierarchy): void {
    if (folder) {
      this.state.addFoldersInTree([folder.hierarchyRepresentation]);
      this.children.addItem(folder.hierarchyRepresentation, () => true);
    }
  }

  hierarchyObjectMenuClick(hierarchyObject: CaHierarchyObject, event: MouseEvent): void {
    ClHelpService.stopEventPropagation(event);
    this.openHierarchyObjectActionMenu(hierarchyObject, event);
  }

  private openHierarchyObjectActionMenu(hierarchyObject: CaHierarchyObject, event: MouseEvent): void {
    const service = new CaFolderActionsMenu(this.injector, {
      id: hierarchyObject.id,
      name: hierarchyObject.name,
      leader: hierarchyObject.user,
    });
    service
      .openTableItemActionMenu(event, true)
      .subscribe((hierarchyObjectActionEvent) =>
        this.onHierarchyObjectActionMenuEvent(hierarchyObjectActionEvent, hierarchyObject)
      );
  }

  private onHierarchyObjectActionMenuEvent(
    event: CaFolderActionEvent,
    hierarchyObject: CaHierarchyObject
  ): void {
    if (!event) return;

    if (event.action === 'update') {
      this.children.updatePartial(hierarchyObject.id, { name: event.folder.name }, CaHierarchyObject);
    } else if (event.action === 'delete') {
      this.children.removeItem(hierarchyObject);
    }
  }
}
