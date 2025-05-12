import { Component, inject, Injector, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { firstValueFrom, Observable } from 'rxjs';
import { CaFolderDetailState } from '../../state/ca-folder-detail.state';
import { map } from 'rxjs/operators';
import {
  CaHierarchyObject,
  CaHierarchyObjectDatasource,
} from '../../../../../ca-core/model/entities/folder/ca-hierarchy-object.class';
import { CaFolderRightPanelState } from '../../state/ca-folder-right-panel.state';
import { ClHelpService } from '@monorepo/core-lib';
import { FlCardModule } from '@monorepo/front-core-lib/fl-card';
import { FlDragModule, FlDropEvent } from '@monorepo/front-core-lib/fl-drag';
import { FlInfiniteScrollModule } from '@monorepo/front-core-lib/fl-infinite-scroll';
import { FlQueryParamHandler, FlTableColumnStatic } from '@monorepo/front-core-lib/fl-core';

import { CaFolder } from '../../../../../ca-core/model/entities/folder/ca-folder.class';
import {
  CaHierarchyObjectTableComponent,
  CaHierarchyObjectTableEvent,
} from '../../../../../ca-core/entity-module/ca-hierarchy-object-core/component/ca-hierarchy-object-table/ca-hierarchy-object-table.component';
import {
  CaFolderActionEvent,
  CaFolderActionsMenu,
} from '../../../../../ca-core/entity-module/ca-folder-core/model/ca-folder-actions-menu.class';
import { CaHierarchyObjectSearchFields } from '../../../../../ca-core/entity-module/ca-hierarchy-object-core/ca-hierarchy-object-search.class';
import { CaHierarchyObjectBreadcrumbComponent } from '../../../ca-folder-hierarchy-core/component/ca-hierarchy-object-breadcrumb/ca-hierarchy-object-breadcrumb.component';
import { CaFolderDetailComponent } from '../ca-folder-detail/ca-folder-detail.component';
import { CaFolderDetailActionsComponent } from '../ca-folder-detail-actions/ca-folder-detail-actions.component';
import { CaHierarchyObjectSearchFormComponent } from '../../../ca-hierarchy-object-detail-page/ca-hierarchy-object-search-form/ca-hierarchy-object-search-form.component';
import { MatIcon } from '@angular/material/icon';
import { AsyncPipe } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';
import { CaFolderActionService } from '../../../../../ca-core/entity-module/ca-folder-core/ca-folder-action.service';
import { FlSnackBarService } from '@monorepo/front-core-lib/fl-snack-bar';
import { CaUser } from '../../../../../ca-core/model/entities/ca-user.class';
import { CaHierarchyObjectEventState } from '../../../ca-folder-hierarchy-core/state/ca-hierarchy-object-event.state';
import { CaHierarchyObjectActionsMenuComponent } from '../../../ca-folder-hierarchy-core/component/ca-hierarchy-object-actions-menu/ca-hierarchy-object-actions-menu.component';
import { CaHierarchyObjectActionsMenuState } from '../../../ca-folder-hierarchy-core/state/ca-hierarchy-object-actions-menu.state';
import { CaHierarchyObjectDetailState } from '../../../ca-folder-hierarchy-core/state/ca-hierarchy-object-detail.state';

/**
 * Page for a folder detail
 */
@Component({
  selector: 'ca-folder-detail-page',
  templateUrl: './ca-folder-detail-page.component.html',
  styleUrls: ['./ca-folder-detail-page.component.scss'],
  providers: [CaFolderDetailState, FlQueryParamHandler],
  imports: [
    CaHierarchyObjectBreadcrumbComponent,
    FlDragModule,
    FlCardModule,
    CaFolderDetailComponent,
    CaFolderDetailActionsComponent,
    CaHierarchyObjectSearchFormComponent,
    FlInfiniteScrollModule,
    CaHierarchyObjectTableComponent,
    MatIcon,
    AsyncPipe,
    TranslatePipe,
    CaHierarchyObjectActionsMenuComponent,
  ],
})
export class CaFolderDetailPageComponent implements OnInit {
  folderId$: Observable<string>;
  folder$: Observable<CaFolder>;

  children: CaHierarchyObjectDatasource<CaHierarchyObjectSearchFields>;

  columns: FlTableColumnStatic<CaHierarchyObject>[] = [
    'name',
    'user',
    'lastModifiedAt',
    'tags',
    'statusIcons',
    'customAction',
  ];

  private route = inject(ActivatedRoute);
  private state = inject(CaFolderDetailState);
  private rightPanelState = inject(CaFolderRightPanelState);
  private folderActionService = inject(CaFolderActionService);
  private snackBarService = inject(FlSnackBarService);
  private injector = inject(Injector);
  private eventState = inject(CaHierarchyObjectEventState);
  private actionsMenuState = inject(CaHierarchyObjectActionsMenuState);

  users$: Observable<CaUser[]>;

  hierarchyObjectContext$ = inject(CaHierarchyObjectDetailState).getHierarchyContext$();

  constructor() {
    this.state.init(this.getIds$());
    this.users$ = this.state.getUsers().connect();
  }

  ngOnInit(): void {
    this.folderId$ = this.state.getFolderId$();
    this.folder$ = this.state.getFolder$();

    this.children = this.state.childrenDatasource;
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
        this.actionsMenuState.openHierarchyObjectActionMenu(event.hierarchyObject, event.event);
        break;
      case 'middleClick':
        this.actionsMenuState.onHierarchyObjectMiddleClicked(event.hierarchyObject);
        break;
      case 'openChat':
        this.rightPanelState.updateRightPanelState({
          type: 'chat',
          objectId: event.hierarchyObject.id,
        });
        break;
      case 'openDescription':
        this.rightPanelState.updateRightPanelState({
          type: 'description',
          objectId: event.hierarchyObject.id,
        });
        break;
    }
  }

  async onFileDrop(event: FlDropEvent): Promise<void> {
    const items = event.event.dataTransfer.items;
    for (let i = 0; i < items.length; i++) {
      const entry = items[i].webkitGetAsEntry();
      if (entry.isDirectory) {
        this.snackBarService.openErrorMessage('drop_folder_error');
        return;
      }
    }

    const folderId = await firstValueFrom(this.state.getFolderId$());
    this.folderActionService.uploadDocument(folderId, event.files);
  }

  cardRightClick(event: MouseEvent): void {
    ClHelpService.stopEventPropagation(event);
    const folder = this.state.getCurrentFolder();
    if (!folder) return;
    const folderActionsMenu = new CaFolderActionsMenu(this.injector, {
      id: folder.id,
      name: folder.name,
      leader: folder.leader,
    });

    folderActionsMenu.openFolderChildrenActionMenu(event).subscribe((event) => {
      this.onFolderAction(event);
    });
  }

  private getIds$(): Observable<string> {
    return this.route.params.pipe(map((params) => params.id));
  }

  private onFolderAction(folderEvent: CaFolderActionEvent): void {
    if (!folderEvent) return;
    this.eventState.emitFolderEvent(folderEvent);
  }
}
