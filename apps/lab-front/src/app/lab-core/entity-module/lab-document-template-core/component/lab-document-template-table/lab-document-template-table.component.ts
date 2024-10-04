import { Component, EventEmitter, Input, Output } from '@angular/core';
import {
  LabDocumentTemplate,
  LabDocumentTemplateDatasource
} from '../../../../model/entities/lab-document-template.entity';
import { FlTableColumnStatic } from '@monorepo/front-core-lib';

@Component({
  selector: 'lab-document-template-table',
  templateUrl: './lab-document-template-table.component.html',
  styleUrls: ['./lab-document-template-table.component.scss']
})
export class LabDocumentTemplateTableComponent {

  // when true, the row become clickable and resourceSelected event is trigger
  @Input() rowSelectable: boolean = false;

  @Input({required: true}) datasource: LabDocumentTemplateDatasource<any>;

  @Input() columns: FlTableColumnStatic<LabDocumentTemplate>[] = ['title', 'creation', 'lastModification'];

  @Output() documentTemplateSelected: EventEmitter<LabDocumentTemplate> = new EventEmitter();


  rowClicked(documentTemplate: LabDocumentTemplate): void {
    if (this.rowSelectable) {
      this.documentTemplateSelected.next(documentTemplate);
    }
  }
}
