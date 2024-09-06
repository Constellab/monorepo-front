import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { firstValueFrom, Observable } from 'rxjs';
import { CaProjectDetailState } from '../../state/ca-project-detail.state';
import { map } from 'rxjs/operators';
import {
  CaFolder,
  CaFolderDatasource,
  CaFolderObjectType,
  caFolderObjectTypeLabels
} from '../../../../../ca-core/model/entities/project/ca-folder.class';
import { CaFolderRightPanelState } from '../../state/ca-folder-right-panel.state';
import { CaRouterService } from '../../../../../ca-core/service/ca-router.service';
import { CaProjectService } from '../../../../../ca-core/service-api/ca-project.service';
import { CaConstellabDocument, CaDocument } from '../../../../../ca-core/model/entities/project/ca-document.class';
import { ClHelpService, ClSubscriptionHandler } from '@monorepo/core-lib';
import {
  FlDialogService,
  FlDropEvent,
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
import { CaProject } from '../../../../../ca-core/model/entities/project/ca-project.class';
import {
  CaFolderTableEvent
} from '../../../../../ca-core/entity-module/ca-folder-core/component/ca-folder-table/ca-folder-table.component';

/**
 * Page for a project detail
 */
@Component({
  selector: 'ca-project-detail-page',
  templateUrl: './ca-project-detail-page.component.html',
  styleUrls: ['./ca-project-detail-page.component.scss'],
  providers: [CaProjectDetailState, CaFolderRightPanelState]
})
export class CaProjectDetailPageComponent implements OnInit {

  projectId$: Observable<string>;
  project$: Observable<CaProject>;

  children: CaFolderDatasource;

  columns: FlTableColumnStatic<CaFolder>[] = ['name', 'user', 'lastModifiedAt', 'statusIcons', 'customAction'];

  objectTypes = caFolderObjectTypeLabels;
  nameFilter: string = null;
  selectedObjectType: CaFolderObjectType = null;

  private actionName = 'upload-project-document';
  private subscription: ClSubscriptionHandler = new ClSubscriptionHandler();

  // TODO improve
  private hasClicked: boolean = false;

  constructor(private route: ActivatedRoute,
              private routerService: CaRouterService,
              private state: CaProjectDetailState,
              private rightPanelState: CaFolderRightPanelState,
              private projectService: CaProjectService,
              private actionService: FlPortalActionsService,
              private dialogService: FlDialogService) {
    this.state.init(this.getIds$());
  }

  ngOnInit(): void {
    this.projectId$ = this.state.getFolderId$();
    this.project$ = this.state.getProject$();

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

  onFolderRowEvent(event: CaFolderTableEvent): void {
    // TODO HANDLE RIGHT CLICK AND MIDDLE CLICK
    switch (event.action) {
      case 'click':
        this.onFolderClicked(event.folder);
        break;
      case 'dblClick':
        this.onFolderDblClicked(event.folder);
        break;
      case 'openChat':
        this.rightPanelState.updateRightPanelState({ type: 'chat', objectId: event.folder.id });
        break;
      case 'openDescription':
        this.rightPanelState.updateRightPanelState({ type: 'description', objectId: event.folder.id });
        break;
    }
  }

  private onFolderClicked(folder: CaFolder): void {
    this.hasClicked = true;
    setTimeout(() => {
      if (!this.hasClicked) return;
      switch (folder.objectType) {
        case CaFolderObjectType.FOLDER:
          this.routerService.navigateToProjectDetail(folder.id);
          break;
        case CaFolderObjectType.REPORT:
          this.rightPanelState.updateRightPanelState({ type: 'report', objectId: folder.id });
          break;
        case CaFolderObjectType.EXPERIMENT:
          this.rightPanelState.updateRightPanelState({ type: 'experiment', objectId: folder.id });
          break;
        case CaFolderObjectType.CONSTELLAB_DOCUMENT:
          this.rightPanelState.updateRightPanelState({ type: 'constellab-document', objectId: folder.id });
          break;
        case CaFolderObjectType.DOCUMENT:
          this.handleDocumentClick(folder);
          break;
      }
      this.hasClicked = false;
    }, 200);
  }

  private onFolderDblClicked(folder: CaFolder): void {
    this.hasClicked = false;
    switch (folder.objectType) {
      case CaFolderObjectType.FOLDER:
        this.routerService.navigateToProjectDetail(folder.id);
        break;
      case CaFolderObjectType.REPORT:
        this.routerService.navigateToReportDetail(folder.id);
        break;
      case CaFolderObjectType.EXPERIMENT:
        this.routerService.navigateToExperimentDetail(folder.id);
        break;
      case CaFolderObjectType.CONSTELLAB_DOCUMENT:
        this.routerService.navigateToDocumentDetail(folder.id);
        break;
      case CaFolderObjectType.DOCUMENT:
        this.handleDocumentClick(folder);
        break;
    }
  }

  private handleDocumentClick(folder: CaFolder): void {
    if (CaDocument.supportsPreview(folder.name)) {
      this.routerService.navigateToDocumentPreview(folder.id);
    } else {
      const url = this.projectService.getDocumentPreviewUrl(folder.id, folder.name);
      window.open(url, '_blank');
    }
  }

  onFileDrop(event: FlDropEvent): void {
    this.uploadDocument(event.files);
  }

  async uploadDocument(fileEvent: File | File[]): Promise<void> {
    const projectId = await firstValueFrom(this.state.getFolderId$());
    const files = ClHelpService.convertObjectOrArrayToArray(fileEvent);

    for (const file of files) {

      const action: FlPortalAction = {
        type: this.actionName,
        action: this.projectService.uploadDocument(file, projectId),
        text: {
          text: 'uploading_document',
          translateText: true,
          translateParam: { param: { name: file.name } }
        },
        additionalInformation: projectId
      };

      this.actionService.addAction(action, false);
    }
  }

  private async onDocumentUploaded(folder: CaFolder, projectId: string): Promise<void> {
    const currentProjectId = await firstValueFrom(this.state.getFolderId$());
    if (currentProjectId !== projectId) return;
    this.children.unshiftItem(folder);
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
      projectId: await firstValueFrom(this.state.getFolderId$())
    };

    this.dialogService.openMediumDialog(CaDocumentTrashListDialogComponent,
      { data: input, autoFocus: false }).afterClosed()
      .subscribe(restoredDocs => this.onDocumentInTrashClosed(restoredDocs));
  }

  private onDocumentInTrashClosed(restoredDocs?: CaFolder[]): void {
    if (restoredDocs) {
      // TODO FIX TYPE
      this.children.unshiftItem(restoredDocs);
    }
  }

  filterByName(name: string): void {
    this.state.filterChildren({ name });
  }

  selectObjectType(type: CaFolderObjectType): void {
    this.state.filterChildren({ objectType: type });
  }


}
