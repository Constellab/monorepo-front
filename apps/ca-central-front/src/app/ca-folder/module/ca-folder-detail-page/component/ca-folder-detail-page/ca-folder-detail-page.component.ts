import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { firstValueFrom, Observable } from 'rxjs';
import { CaFolderDetailState } from '../../state/ca-folder-detail.state';
import { map } from 'rxjs/operators';
import {
  CaHierarchyObject,
  CaHierarchyObjectDatasource,
  CaHierarchyObjectType,
  caHierarchyObjectTypeLabels
} from '../../../../../ca-core/model/entities/folder/ca-hierarchy-object.class';
import { CaFolderRightPanelState } from '../../state/ca-folder-right-panel.state';
import { CaRouterService } from '../../../../../ca-core/service/ca-router.service';
import { CaFolderService } from '../../../../../ca-core/service-api/ca-folder.service';
import { CaConstellabDocument, CaDocument } from '../../../../../ca-core/model/entities/folder/ca-document.class';
import { ClHelpService, ClSubscriptionHandler } from '@monorepo/core-lib';
import {
  FlDialogService,
  FlDropEvent,
  FlMenuDynamicService,
  FlPortalAction,
  FlPortalActionsService,
  FlTableColumnStatic
} from '@monorepo/front-core-lib';
import {
  CaDocumentNameFormDialogComponent,
  CaDocumentNameFormDialogInput
} from '../../../ca-document-core/component/ca-document-name-form-dialog/ca-document-name-form-dialog.component';
import {
  CaDocumentTrashListDialogComponent,
  CaDocumentTrashListDialogInput
} from '../ca-document-trash-list-dialog/ca-document-trash-list-dialog.component';
import { CaFolder } from '../../../../../ca-core/model/entities/folder/ca-folder.class';
import {
  CaHierarchyObjectTableEvent
} from '../../../../../ca-core/entity-module/ca-hierarchy-object-core/component/ca-hierarchy-object-table/ca-hierarchy-object-table.component';
import { CaHierarchyObjectActionEvent, CaHierarchyObjectActionMenu } from '../../ca-hierarchy-object-action-menu';

/**
 * Page for a folder detail
 */
@Component({
  selector: 'ca-folder-detail-page',
  templateUrl: './ca-folder-detail-page.component.html',
  styleUrls: ['./ca-folder-detail-page.component.scss'],
  providers: [CaFolderDetailState, CaFolderRightPanelState]
})
export class CaFolderDetailPageComponent implements OnInit {

  folderId$: Observable<string>;
  folder$: Observable<CaFolder>;

  children: CaHierarchyObjectDatasource;

  columns: FlTableColumnStatic<CaHierarchyObject>[] = ['name', 'user', 'lastModifiedAt', 'statusIcons', 'customAction'];

  objectTypes = caHierarchyObjectTypeLabels;
  nameFilter: string = null;
  selectedObjectType: CaHierarchyObjectType = null;

  private actionName = 'upload-folder-document';
  private subscription: ClSubscriptionHandler = new ClSubscriptionHandler();

  constructor(private route: ActivatedRoute,
              private routerService: CaRouterService,
              private state: CaFolderDetailState,
              private rightPanelState: CaFolderRightPanelState,
              private folderService: CaFolderService,
              private actionService: FlPortalActionsService,
              private dialogService: FlDialogService,
              private menuDynamicService: FlMenuDynamicService) {
    this.state.init(this.getIds$());
  }

  ngOnInit(): void {
    this.folderId$ = this.state.getFolderId$();
    this.folder$ = this.state.getFolder$();

    this.children = this.state.getChildrenDatasource();

    // call init method of right panel state on the init to let the ui load
    this.rightPanelState.init();

    this.subscription.add(this.actionService.getResult$(this.actionName).subscribe(action => {
      if (action?.status === 'success') {
        this.onDocumentUploaded(action.result, action.additionalInformation);
      }
    }));
  }

  private getIds$(): Observable<string> {
    return this.route.params.pipe(
      map(params => params.id)
    );
  }

  onHierarchyObjectRowEvent(event: CaHierarchyObjectTableEvent): void {
    // TODO HANDLE RIGHT CLICK AND MIDDLE CLICK
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
      case 'openChat':
        this.rightPanelState.updateRightPanelState({
          type: 'chat',
          objectId: event.hierarchyObject.id
        });
        break;
      case 'openDescription':
        this.rightPanelState.updateRightPanelState({
          type: 'description',
          objectId: event.hierarchyObject.id
        });
        break;
    }
  }

  private onHierarchyObjectClicked(hierarchyObject: CaHierarchyObject): void {
    switch (hierarchyObject.objectType) {
      case CaHierarchyObjectType.FOLDER:
        this.routerService.navigateToFolderDetail(hierarchyObject.id);
        break;
      case CaHierarchyObjectType.REPORT:
        this.rightPanelState.updateRightPanelState({
          type: 'report',
          objectId: hierarchyObject.id
        });
        break;
      case CaHierarchyObjectType.EXPERIMENT:
        this.rightPanelState.updateRightPanelState({
          type: 'experiment',
          objectId: hierarchyObject.id
        });
        break;
      case CaHierarchyObjectType.CONSTELLAB_DOCUMENT:
        this.rightPanelState.updateRightPanelState({
          type: 'constellab-document',
          objectId: hierarchyObject.id
        });
        break;
      case CaHierarchyObjectType.DOCUMENT:
        this.handleDocumentClick(hierarchyObject);
        break;
    }
  }

  private onHierarchyObjectDblClicked(hierarchyObject: CaHierarchyObject): void {
    switch (hierarchyObject.objectType) {
      case CaHierarchyObjectType.FOLDER:
        this.routerService.navigateToFolderDetail(hierarchyObject.id);
        break;
      case CaHierarchyObjectType.REPORT:
        this.routerService.navigateToReportDetail(hierarchyObject.id);
        break;
      case CaHierarchyObjectType.EXPERIMENT:
        this.routerService.navigateToExperimentDetail(hierarchyObject.id);
        break;
      case CaHierarchyObjectType.CONSTELLAB_DOCUMENT:
        this.routerService.navigateToDocumentDetail(hierarchyObject.id);
        break;
      case CaHierarchyObjectType.DOCUMENT:
        this.handleDocumentClick(hierarchyObject);
        break;
    }
  }

  hierarchyObjectMenuClick(hierarchyObject: CaHierarchyObject, event: MouseEvent): void {
    ClHelpService.stopEventPropagation(event);
    this.openHierarchyObjectActionMenu(hierarchyObject, event);
  }

  private openHierarchyObjectActionMenu(hierarchyObject: CaHierarchyObject, event: MouseEvent): void {
    const service = new CaHierarchyObjectActionMenu(this.dialogService, this.folderService, this.actionService,
      this.menuDynamicService, hierarchyObject);
    service.openActionMenu(event).subscribe(
      hierarchyObjectActionEvent => this.onHierarchyObjectActionMenuEvent(hierarchyObjectActionEvent, hierarchyObject)
    );
  }

  private onHierarchyObjectActionMenuEvent(event: CaHierarchyObjectActionEvent, hierarchyObject: CaHierarchyObject): void {
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
    }
  }

  private handleDocumentClick(hierarchyObject: CaHierarchyObject): void {
    if (CaDocument.supportsPreview(hierarchyObject.name)) {
      this.routerService.navigateToDocumentPreview(hierarchyObject.id);
    } else {
      const url = this.folderService.getDocumentPreviewUrl(hierarchyObject.id, hierarchyObject.name);
      window.open(url, '_blank');
    }
  }

  onFileDrop(event: FlDropEvent): void {
    this.uploadDocument(event.files);
  }

  async uploadDocument(fileEvent: File | File[]): Promise<void> {
    const folderId = await firstValueFrom(this.state.getFolderId$());
    const files = ClHelpService.convertObjectOrArrayToArray(fileEvent);

    for (const file of files) {

      const action: FlPortalAction = {
        type: this.actionName,
        action: this.folderService.uploadDocument(file, folderId),
        text: {
          text: 'uploading_document',
          translateText: true,
          translateParam: { param: { name: file.name } }
        },
        additionalInformation: folderId
      };

      this.actionService.addAction(action, false);
    }
  }

  private async onDocumentUploaded(hierarchyObject: CaHierarchyObject, folderId: string): Promise<void> {
    const currentFolderId = await firstValueFrom(this.state.getFolderId$());
    if (currentFolderId !== folderId) return;
    this.children.unshiftItem(hierarchyObject);
  }

  async createConstellabDocument(): Promise<void> {
    const input: CaDocumentNameFormDialogInput = {
      mode: 'create',
      parentFolderId: await firstValueFrom(this.state.getFolderId$())
    };

    this.dialogService.openSmallDialog(CaDocumentNameFormDialogComponent, { data: input }).afterClosed()
      .subscribe((doc: CaConstellabDocument) => this.createConstellabDocClosed(doc));
  }

  private createConstellabDocClosed(doc?: CaConstellabDocument): void {
    if (doc) {
      this.routerService.navigateToDocumentDetail(doc.document.id);
    }
  }

  async openDocumentInTrash(): Promise<void> {
    const input: CaDocumentTrashListDialogInput = {
      folderId: await firstValueFrom(this.state.getFolderId$())
    };

    this.dialogService.openMediumDialog(CaDocumentTrashListDialogComponent,
      { data: input, autoFocus: false }).afterClosed()
      .subscribe(restoredDocs => this.onDocumentInTrashClosed(restoredDocs));
  }

  private onDocumentInTrashClosed(restoredDocs?: CaDocument[]): void {
    if (restoredDocs?.length > 0) {
      // refresh the data
      this.children.getFirstPage(this.children.getRequestData());
    }
  }

  filterByName(name: string): void {
    this.state.filterChildren({ name });
  }

  selectObjectType(type: CaHierarchyObjectType): void {
    this.state.filterChildren({ objectType: type });
  }


}
