import {Component, EventEmitter, Input, Output} from '@angular/core';
import {FlTableColumnStatic} from '@monorepo/front-core-lib';
import {CaDocument, CaDocumentDatasource} from '../../../../../ca-core/model/entities/project/ca-document.class';
import {CaDocumentActionEvent} from '../ca-document-actions-menu/ca-document-actions-menu.component';

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

  onDocumentAction(event: CaDocumentActionEvent): void {
    if (event.action === 'update') {
      this.datasource.updateItem(event.document);
    } else if (event.action === 'delete') {
      this.datasource.removeItem(event.document);
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
    }
    this.documentAction.emit(event);
  }


}
