import {Component, OnDestroy, OnInit} from '@angular/core';
import {CaProjectDetailState} from '../../state/ca-project-detail.state';
import {CaProjectService} from '../../../../../ca-core/service-api/ca-project.service';
import {
  CaConstellabDocument,
  CaDocument,
  CaDocumentDatasource
} from '../../../../../ca-core/model/entities/project/ca-document.class';
import {firstValueFrom} from 'rxjs';
import {FlDialogService, FlPortalAction, FlPortalActionsService, FlTranslateService} from '@monorepo/front-core-lib';
import {ClHelpService, ClSubscriptionHandler} from '@monorepo/core-lib';
import {CaRouterService} from '../../../../../ca-core/service/ca-router.service';
import {
  CaDocumentNameFormDialogComponent,
  CaDocumentNameFormDialogInput
} from '../../../ca-document-core/component/ca-document-name-form-dialog/ca-document-name-form-dialog.component';
import {
  CaDocumentTrashListDialogComponent,
  CaDocumentTrashListDialogInput
} from '../ca-document-trash-list-dialog/ca-document-trash-list-dialog.component';

/**
 * Card to list the document of the current project
 */
@Component({
  selector: 'ca-project-documents-list',
  templateUrl: './ca-project-documents-list.component.html',
  styleUrls: ['./ca-project-documents-list.component.scss']
})
export class CaProjectDocumentsListComponent implements OnInit, OnDestroy {

  documentDatasource: CaDocumentDatasource;

  private actionName = 'upload-project-document';
  private subscription: ClSubscriptionHandler = new ClSubscriptionHandler();

  constructor(private state: CaProjectDetailState,
              private projectService: CaProjectService,
              private actionService: FlPortalActionsService,
              private translateService: FlTranslateService,
              private routerService: CaRouterService,
              private dialogService: FlDialogService) {
  }

  ngOnInit(): void {
    this.subscription.add(this.state.getProjectId$().subscribe(projectId => {
      this.getDocuments(projectId);
    }));

    this.subscription.add(this.actionService.getResult$(this.actionName).subscribe(action => {
      if (action?.status === 'success') {
        this.onDocumentUploaded(action.result, action.additionalInformation);
      }
    }));
  }

  private getDocuments(projectId: string): void {
    this.documentDatasource = this.projectService.getDocumentsDatasource(projectId);
  }

  async uploadDocument(fileEvent: File | File[]): Promise<void> {
    const projectId = await firstValueFrom(this.state.getProjectId$());
    const files = ClHelpService.convertObjectOrArrayToArray(fileEvent);

    for (const file of files) {

      const action: FlPortalAction = {
        type: this.actionName,
        action: this.projectService.uploadDocument(file, projectId),
        text: this.translateService.translate('uploading_document',
          {param: {name: file.name}}),
        additionalInformation: projectId
      };

      this.actionService.addAction(action, false);
    }
  }

  private async onDocumentUploaded(document: CaDocument, projectId: string): Promise<void> {
    const currentProjectId = await firstValueFrom(this.state.getProjectId$());
    if (currentProjectId !== projectId) return;
    this.documentDatasource.unshiftItem(document);
  }

  async createConstellabDocument(): Promise<void> {
    const input: CaDocumentNameFormDialogInput = {
      mode: 'create',
      projectId: await firstValueFrom(this.state.getProjectId$())
    };

    this.dialogService.openSmallDialog(CaDocumentNameFormDialogComponent, {data: input}).afterClosed()
      .subscribe((doc: CaConstellabDocument) => this.createConstellabDocClosed(doc));
  }

  private createConstellabDocClosed(doc?: CaConstellabDocument): void {
    if (doc) {
      this.routerService.navigateToDocumentDetail(doc.document.id);
    }
  }

  async openDocumentInTrash(): Promise<void> {
    const input: CaDocumentTrashListDialogInput = {
      projectId: await firstValueFrom(this.state.getProjectId$())
    };

    this.dialogService.openMediumDialog(CaDocumentTrashListDialogComponent, {data: input}).afterClosed()
      .subscribe(restoredDocs => this.onDocumentInTrashClosed(restoredDocs));
  }

  private onDocumentInTrashClosed(restoredDocs?: CaDocument[]): void {
    if (restoredDocs) {
      this.documentDatasource.unshiftItem(restoredDocs);
    }
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }


}
