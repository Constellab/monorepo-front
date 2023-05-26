import {Component, EventEmitter, Input, Output} from '@angular/core';
import {FlArrayObs, FlTableColumnStatic} from '@monorepo/front-core-lib';
import {LabProtocolTemplate} from '../../../../model/entities/process/lab-protocol-template.entity';

@Component({
  selector: 'lab-protocol-template-table',
  templateUrl: './lab-protocol-template-table.component.html',
  styleUrls: ['./lab-protocol-template-table.component.scss'],
})
export class LabProtocolTemplateTableComponent {

  @Input() datasource: FlArrayObs<LabProtocolTemplate>;

  @Input() columns: FlTableColumnStatic<LabProtocolTemplate>[];

  @Output() templateSelected: EventEmitter<LabProtocolTemplate> = new EventEmitter();

  rowClicked(template: LabProtocolTemplate): void {
    this.templateSelected.emit(template);
  }

  openInNewTab(event: MouseEvent): void {
    event.stopPropagation();
  }

}
