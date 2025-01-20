import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FlArrayObs, FlTableColumnStatic, FlTag } from '@monorepo/front-core-lib';
import { LabViewConfig } from '../../../../model/entities/resource/lab-view-config.entity';
import { LabRouterService } from '../../../../service/lab-router.service';

@Component({
    selector: 'lab-view-config-table',
    templateUrl: './lab-view-config-table.component.html',
    styleUrls: ['./lab-view-config-table.component.scss'],
    standalone: false
})
export class LabViewConfigTableComponent {
  @Input({ required: true }) datasource: FlArrayObs<LabViewConfig>;

  @Input() columns: FlTableColumnStatic<LabViewConfig>[] = ['title', 'resource', 'lastModifiedAt', 'preview'];

  // when true, the row become clickable and resourceSelected event is trigger
  @Input() selectableRow: boolean = false;

  @Input() rowLinkTarget: '_self' | '_blank' = '_self';

  @Input() tagSelectable: boolean = true;

  @Output() tagSelected: EventEmitter<FlTag> = new EventEmitter();

  @Output() viewConfigSelected: EventEmitter<LabViewConfig> = new EventEmitter();

  constructor(private routerService: LabRouterService) {}

  rowClicked(viewConfig: LabViewConfig): void {
    if (this.selectableRow) {
      this.viewConfigSelected.next(viewConfig);
    }
  }

  onUpdate(viewConfig: LabViewConfig): void {
    this.datasource.updateItem(viewConfig);
  }

  navigateToViewConfigPage(viewConfig: LabViewConfig): void {
    this.routerService.navigateToViewConfig(viewConfig.resource.id, viewConfig.id);
  }
}
