import {Component, EventEmitter, Input, Output} from '@angular/core';
import {FlArrayObs, FlTableColumnStatic, FlTag, FlTagSelectedEvent} from '@monorepo/front-core-lib';
import {LabViewConfig} from '../../../../model/entities/resource/lab-view-config.entity';
import {ClHelpService} from '@monorepo/core-lib';
import {LabViewConfigService} from '../../../../entity-service/lab-view-config.service';
import {LabRouterService} from '../../../../service/lab-router.service';
import {labConstResourceViewTypeInfos} from '../../../../model/entities/resource/lab-resource-view-type.class';

@Component({
  selector: 'lab-view-config-table',
  templateUrl: './lab-view-config-table.component.html',
  styleUrls: ['./lab-view-config-table.component.scss']
})
export class LabViewConfigTableComponent {

  @Input() datasource: FlArrayObs<LabViewConfig>;

  @Input() columns: FlTableColumnStatic<LabViewConfig>[];

  // when true, the row become clickable and resourceSelected event is trigger
  @Input() selectableRow: boolean = false;

  @Input() tagSelectable: boolean = true;

  @Output() tagSelected: EventEmitter<FlTag> = new EventEmitter();

  @Output() viewConfigSelected: EventEmitter<LabViewConfig> = new EventEmitter();

  constructor(private viewConfigService: LabViewConfigService,
              private routerService: LabRouterService) {
  }

  rowClicked(viewConfig: LabViewConfig): void {
    if (this.selectableRow) {
      this.viewConfigSelected.next(viewConfig);
    }
  }

  onUpdate(viewConfig: LabViewConfig): void {
    this.datasource.updateItem(viewConfig);
  }

  onTagSelected(tagEvent: FlTagSelectedEvent): void {
    ClHelpService.stopEventPropagation(tagEvent.event);
    this.tagSelected.next(tagEvent.tag);
  }

  navigateToViewConfigPage(viewConfig: LabViewConfig): void {
    this.routerService.navigateToViewConfig(viewConfig.resource.id, viewConfig.id);
  }

  protected readonly labConstResourceViewTypeInfos = labConstResourceViewTypeInfos;
}
