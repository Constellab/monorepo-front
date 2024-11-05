import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FlArrayObs, FlTableColumnStatic } from '@monorepo/front-core-lib';
import { LabScenarioTemplate } from '../../../../model/entities/process/lab-scenario-template.entity';

@Component({
  selector: 'lab-scenario-template-table',
  templateUrl: './lab-scenario-template-table.component.html',
  styleUrls: ['./lab-scenario-template-table.component.scss'],
})
export class LabScenarioTemplateTableComponent {
  @Input({ required: true }) datasource: FlArrayObs<LabScenarioTemplate>;

  @Input() columns: FlTableColumnStatic<LabScenarioTemplate>[] = ['name', 'tags', 'lastModification'];

  @Input() rowSelectable: boolean = false;

  @Input() rowLinkTarget: '_self' | '_blank' = '_self';

  @Output() templateSelected: EventEmitter<LabScenarioTemplate> = new EventEmitter();

  rowClicked(template: LabScenarioTemplate): void {
    if (this.rowSelectable) {
      this.templateSelected.emit(template);
    }
  }

  openInNewTab(event: MouseEvent): void {
    event.stopPropagation();
  }
}
