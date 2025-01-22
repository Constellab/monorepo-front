import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import {
  FlDialogService,
  FlMenuDynamicService,
  FlPortalActionsService,
  FlTableColumnStatic,
} from '@monorepo/front-core-lib';
import {
  CaDocument,
  CaDocumentDatasource,
} from '../../../../../ca-core/model/entities/folder/ca-document.class';
import { CaFolderService } from '../../../../../ca-core/service-api/ca-folder.service';
import { CaRouterService } from '../../../../../ca-core/service/ca-router.service';
import { ClHelpService } from '@monorepo/core-lib';
import { CaDocumentActionEvent, CaDocumentActionMenu } from '../../ca-document-action-menu';

@Component({
  selector: 'ca-document-table',
  templateUrl: './ca-document-table.component.html',
  styleUrls: ['./ca-document-table.component.scss'],
  standalone: false,
})
export class CaDocumentTableComponent {
  private folderService = inject(CaFolderService);
  private routerService = inject(CaRouterService);
  private dialogService = inject(FlDialogService);
  private menuDynamicService = inject(FlMenuDynamicService);
  private actionService = inject(FlPortalActionsService);

  @Input() datasource: CaDocumentDatasource;

  @Input() isTrash: boolean = false;

  @Input() columns: FlTableColumnStatic<CaDocument>[] = ['name', 'size', 'creationInfo', 'actions'];

  @Output() documentAction: EventEmitter<CaDocumentActionEvent> = new EventEmitter();

  openDocumentPreview(document: CaDocument): void {
    if (document.canTokenPreview) {
      this.routerService.navigateToDocumentPreview(document.id);
    } else if (document.isConstellabDocument()) {
      this.routerService.navigateToDocumentDetail(document.id);
    } else {
      const url = this.folderService.getDocumentPreviewUrl(document.id, document.name);
      window.open(url, '_blank');
    }
  }

  openDocumentActionMenu(document: CaDocument, event: MouseEvent): void {
    ClHelpService.stopEventPropagation(event);
    const documentActionMenu = new CaDocumentActionMenu(
      this.dialogService,
      this.folderService,
      this.menuDynamicService,
      this.actionService,
      document.basicInfo
    );

    documentActionMenu.openActionMenu(true, event).subscribe((event) => {
      this.onDocumentAction(event, document);
    });
  }

  private onDocumentAction(event: CaDocumentActionEvent, oldDocument: CaDocument): void {
    if (event.action === 'update') {
      this.datasource.updateItem(event.document);
    } else if (event.action === 'delete') {
      this.datasource.removeItem(oldDocument);
    } else if (event.action === 'moveToTrash') {
      if (this.isTrash) {
        this.datasource.addItem(event.document);
      } else {
        this.datasource.removeItem(event.document);
      }
    } else if (event.action === 'restoreFromTrash') {
      if (this.isTrash) {
        this.datasource.removeItem(event.document);
      } else {
        this.datasource.addItem(event.document);
      }
    } else if (event.action === 'moveToFolder') {
      this.datasource.removeItem(event.document);
    }
    this.documentAction.emit(event);
  }
}
