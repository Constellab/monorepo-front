import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { firstValueFrom, Observable } from 'rxjs';
import { CaFolderDetailState } from '../../state/ca-folder-detail.state';
import { map } from 'rxjs/operators';
import {
  CaHierarchyObject,
  CaHierarchyObjectDatasource,
  CaHierarchyObjectType,
} from '../../../../../ca-core/model/entities/folder/ca-hierarchy-object.class';
import { CaFolderRightPanelState } from '../../state/ca-folder-right-panel.state';
import { CaRouterService } from '../../../../../ca-core/service/ca-router.service';
import { CaFolderService } from '../../../../../ca-core/service-api/ca-folder.service';
import { CaDocument } from '../../../../../ca-core/model/entities/folder/ca-document.class';
import { ClHelpService } from '@monorepo/core-lib';
import { FlCardModule } from '@monorepo/front-core-lib/fl-card';
import { FlDialogService } from '@monorepo/front-core-lib/fl-dialog';
import { FlDragModule, FlDropEvent } from '@monorepo/front-core-lib/fl-drag';
import { FlInfiniteScrollModule } from '@monorepo/front-core-lib/fl-infinite-scroll';
import { FlMenuDynamicService } from '@monorepo/front-core-lib/fl-menu-dynamic';
import { FlPortalActionsService } from '@monorepo/front-core-lib/fl-portal-actions';
import { FlQueryParamHandler, FlTableColumnStatic } from '@monorepo/front-core-lib/fl-core';
import { FlSearchState } from '@monorepo/front-core-lib/fl-search';

import { CaFolder } from '../../../../../ca-core/model/entities/folder/ca-folder.class';
import {
  CaHierarchyObjectTableComponent,
  CaHierarchyObjectTableEvent,
} from '../../../../../ca-core/entity-module/ca-hierarchy-object-core/component/ca-hierarchy-object-table/ca-hierarchy-object-table.component';
import {
  CaHierarchyObjectActionEvent,
  CaHierarchyObjectActionMenu,
} from '../../ca-hierarchy-object-action-menu';
import {
  CaFolderActionEvent,
  CaFolderActionsMenu,
} from '../../../../../ca-core/entity-module/ca-folder-core/model/ca-folder-actions-menu.class';
import {
  CaHierarchyObjectSearchFields,
} from '../../../../../ca-core/entity-module/ca-hierarchy-object-core/model/ca-hierarchy-object-search.class';
import { CaSecurityService } from '../../../../../ca-core/service/ca-security.service';
import { CaResourceService } from '../../../../../ca-core/service-api/ca-resource.service';
import {
  CaHierarchyObjectBreadcrumbComponent,
} from '../../../ca-folder-hierarchy-core/component/ca-hierarchy-object-breadcrumb/ca-hierarchy-object-breadcrumb.component';
import { CaFolderDetailComponent } from '../ca-folder-detail/ca-folder-detail.component';
import {
  CaFolderDetailActionsComponent,
} from '../ca-folder-detail-actions/ca-folder-detail-actions.component';
import {
  CaHierarchyObjectSearchFormComponent,
} from '../ca-hierarchy-object-search-form/ca-hierarchy-object-search-form.component';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { AsyncPipe } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';
import {
  CaFolderActionService,
} from '../../../../../ca-core/entity-module/ca-folder-core/ca-folder-action.service';
import { FlSnackBarService } from '@monorepo/front-core-lib/fl-snack-bar';

/**
 * Page for a folder detail
 */
@Component({
  selector: 'ca-folder-detail-page',
  templateUrl: './ca-folder-detail-page.component.html',
  styleUrls: ['./ca-folder-detail-page.component.scss'],
  providers: [FlSearchState, CaFolderDetailState, CaFolderRightPanelState, FlQueryParamHandler],
  imports: [
    CaHierarchyObjectBreadcrumbComponent,
    FlDragModule,
    FlCardModule,
    CaFolderDetailComponent,
    CaFolderDetailActionsComponent,
    CaHierarchyObjectSearchFormComponent,
    FlInfiniteScrollModule,
    CaHierarchyObjectTableComponent,
    MatIconButton,
    MatIcon,
    AsyncPipe,
    TranslatePipe,
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
    'statusIcons',
    'customAction',
  ];

  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private routerService = inject(CaRouterService);
  private state = inject(CaFolderDetailState);
  private rightPanelState = inject(CaFolderRightPanelState);
  private folderService = inject(CaFolderService);
  private folderActionService = inject(CaFolderActionService);
  private actionService = inject(FlPortalActionsService);
  private dialogService = inject(FlDialogService);
  private menuDynamicService = inject(FlMenuDynamicService);
  private securityService = inject(CaSecurityService);
  private resourceService = inject(CaResourceService);
  private snackBarService = inject(FlSnackBarService);

  constructor() {
    this.state.init(this.getIds$());
  }

  ngOnInit(): void {
    this.folderId$ = this.state.getFolderId$();
    this.folder$ = this.state.getFolder$();

    this.children = this.state.getChildrenDatasource();

    // call init method of right panel state on the init to let the ui load
    this.rightPanelState.init();
  }

  onHierarchyObjectRowEvent(event: CaHierarchyObjectTableEvent): void {
    switch (event.action) {
      case 'click':
        this.onHierarchyObjectClicked(event.hierarchyObject);
        break;
      case 'dblClick':
        this.onHierarchyObjectDblClicked(event.hierarchyObject);
        break;
      case 'rightClick':
        this.openHierarchyObjectActionMenu(event.hierarchyObject, event.event);
        break;
      case 'middleClick':
        this.handleMiddleClick(event.hierarchyObject);
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

  hierarchyObjectMenuClick(hierarchyObject: CaHierarchyObject, event: MouseEvent): void {
    ClHelpService.stopEventPropagation(event);
    this.openHierarchyObjectActionMenu(hierarchyObject, event);
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

  hierarchyObjectHasActionMenu(hierarchyObject: CaHierarchyObject): boolean {
    return [
      CaHierarchyObjectType.FOLDER,
      CaHierarchyObjectType.DOCUMENT,
      CaHierarchyObjectType.CONSTELLAB_DOCUMENT,
      CaHierarchyObjectType.RESOURCE,
    ].includes(hierarchyObject.objectType);
  }

  cardRightClick(event: MouseEvent): void {
    ClHelpService.stopEventPropagation(event);
    const folder = this.state.getCurrentFolder();
    if (!folder) return;
    const folderActionsMenu = new CaFolderActionsMenu(
      this.dialogService,
      this.folderActionService,
      this.menuDynamicService,
      this.securityService,
      {
        id: folder.id,
        name: folder.name,
        leader: folder.leader,
      }
    );

    folderActionsMenu.openFolderChildrenActionMenu(event).subscribe((event) => {
      this.onFolderAction(event);
    });
  }

  openDescription(folder: CaFolder): void {
    this.rightPanelState.updateRightPanelState({ type: 'description', objectId: folder.id });
  }

  openChat(folder: CaFolder): void {
    this.rightPanelState.updateRightPanelState({ type: 'chat', objectId: folder.id });
  }

  private getIds$(): Observable<string> {
    return this.route.params.pipe(map((params) => params.id));
  }

  private onHierarchyObjectClicked(hierarchyObject: CaHierarchyObject): void {
    switch (hierarchyObject.objectType) {
      case CaHierarchyObjectType.FOLDER:
        this.routerService.navigateToFolderDetail(hierarchyObject.id);
        break;
      case CaHierarchyObjectType.NOTE:
        this.rightPanelState.updateRightPanelState({
          type: 'note',
          objectId: hierarchyObject.id,
        });
        break;
      case CaHierarchyObjectType.SCENARIO:
      case CaHierarchyObjectType.RESOURCE:
        // no preview for scenario, nor resource
        this.onHierarchyObjectDblClicked(hierarchyObject);
        break;
      case CaHierarchyObjectType.CONSTELLAB_DOCUMENT:
        this.rightPanelState.updateRightPanelState({
          type: 'constellab-document',
          objectId: hierarchyObject.id,
        });
        break;
      case CaHierarchyObjectType.DOCUMENT:
        const route = this.getDocumentRoute(hierarchyObject);
        if (route) {
          this.routerService.navigate(route);
        }
        break;
    }
  }

  private onHierarchyObjectDblClicked(hierarchyObject: CaHierarchyObject): void {
    const route = this.getObjectRoute(hierarchyObject);
    if (route) {
      this.routerService.navigate(route);
    }
  }

  private openHierarchyObjectActionMenu(hierarchyObject: CaHierarchyObject, event: MouseEvent): void {
    const service = new CaHierarchyObjectActionMenu(
      this.dialogService,
      this.folderService,
      this.folderActionService,
      this.actionService,
      this.menuDynamicService,
      this.securityService,
      this.resourceService,
      hierarchyObject
    );
    service
      .openActionMenu(event)
      .subscribe((hierarchyObjectActionEvent) =>
        this.onHierarchyObjectActionMenuEvent(hierarchyObjectActionEvent, hierarchyObject)
      );
  }

  private onHierarchyObjectActionMenuEvent(
    event: CaHierarchyObjectActionEvent,
    hierarchyObject: CaHierarchyObject
  ): void {
    if (!event) return;

    if (event.entity === 'folder') {
      if (event.event.action === 'update') {
        this.state.updateFolder(event.event.folder);
      } else if (event.event.action === 'delete') {
        this.state.deleteHierarchyObject(event.event.folder.id);
      } else if (event.event.action === 'createChild') {
        this.state.addChild(event.event.folder.hierarchyRepresentation);
      }
    } else if (event.entity === 'document') {
      if (event.event.action === 'update') {
        this.state.updatePartialChild(event.event.document.id, { name: event.event.document.name });
      } else if (event.event.action === 'delete') {
        this.state.deleteHierarchyObject(hierarchyObject.id);
      } else if (event.event.action === 'moveToTrash') {
        this.state.deleteHierarchyObject(event.event.document.id);
      } else if (event.event.action === 'moveToFolder') {
        this.state.deleteHierarchyObject(event.event.document.id);
      }
    } else if (event.entity === 'resource') {
      if (event.event.action === 'deleteResource') {
        this.state.deleteHierarchyObject(event.event.resource.id);
      }
    }
  }

  private handleMiddleClick(hierarchyObject: CaHierarchyObject): void {
    const route = this.getObjectRoute(hierarchyObject);
    if (route) {
      const url = this.router.createUrlTree([route]).toString();
      window.open(url, '_blank');
    }
  }

  private getObjectRoute(hierarchyObject: CaHierarchyObject): string {
    switch (hierarchyObject.objectType) {
      case CaHierarchyObjectType.FOLDER:
        return CaRouterService.getFolderDetailRoute(hierarchyObject.id);
      case CaHierarchyObjectType.NOTE:
        return CaRouterService.getNoteDetailRoute(hierarchyObject.id);
      case CaHierarchyObjectType.SCENARIO:
        return CaRouterService.getScenarioDetailRoute(hierarchyObject.id);
      case CaHierarchyObjectType.CONSTELLAB_DOCUMENT:
        return CaRouterService.getDocumentDetailRoute(hierarchyObject.id);
      case CaHierarchyObjectType.DOCUMENT:
        return this.getDocumentRoute(hierarchyObject);
      case CaHierarchyObjectType.RESOURCE:
        return CaRouterService.getResourceDetailRoute(hierarchyObject.id);
    }
  }

  private getDocumentRoute(hierarchyObject: CaHierarchyObject): string {
    if (CaDocument.supportsPreview(hierarchyObject.name)) {
      return CaRouterService.getDocumentPreviewRoute(hierarchyObject.id);
    } else {
      const url = this.folderService.getDocumentPreviewUrl(hierarchyObject.id, hierarchyObject.name);
      window.open(url, '_blank');
      return null;
    }
  }

  private onFolderAction(folderEvent: CaFolderActionEvent): void {
    if (!folderEvent) return;
    if (folderEvent.action === 'createChild') {
      this.state.addChild(folderEvent.folder.hierarchyRepresentation);
    } else if (folderEvent.action === 'createConstellabDocument') {
      this.routerService.navigateToDocumentDetail(folderEvent.document.document.id);
    }
  }
}
