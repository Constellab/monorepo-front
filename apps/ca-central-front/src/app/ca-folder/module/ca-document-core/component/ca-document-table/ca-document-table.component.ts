import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FlTableColumnStatic } from '@monorepo/front-core-lib';
import { CaDocument, CaDocumentDatasource } from '../../../../../ca-core/model/entities/folder/ca-document.class';
import { CaDocumentActionEvent } from '../ca-document-actions-menu/ca-document-actions-menu.component';
import { CaFolderService } from '../../../../../ca-core/service-api/ca-folder.service';
import { CaRouterService } from '../../../../../ca-core/service/ca-router.service';

@Component({
  selector: 'ca-document-table',
  templateUrl: './ca-document-table.component.html',
  styleUrls: ['./ca-document-table.component.scss']
})
export class CaDocumentTableComponent {

  @Input() datasource: CaDocumentDatasource;

  @Input() isTrash: boolean = false;

  @Input() columns: FlTableColumnStatic<CaDocument>[] = ['name', 'size', 'creationInfo', 'actions'];

  @Output() documentAction: EventEmitter<CaDocumentActionEvent> = new EventEmitter();

  constructor(private folderService: CaFolderService,
              private routerService: CaRouterService) {
  }

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

  onDocumentAction(event: CaDocumentActionEvent, oldDocument: CaDocument): void {
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
