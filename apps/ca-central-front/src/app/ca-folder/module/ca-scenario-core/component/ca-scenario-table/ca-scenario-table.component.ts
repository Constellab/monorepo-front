import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FlDatasource, FlTableColumnStatic } from '@monorepo/front-core-lib/fl-core';
import { CaScenario } from '../../../../../ca-core/model/entities/folder/ca-scenario.class';
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell,
  MatHeaderCellDef,
  MatHeaderRow,
  MatHeaderRowDef,
  MatRow,
  MatRowDef,
  MatTable,
} from '@angular/material/table';
import { RouterLink } from '@angular/router';
import { CaNotificationMarkDirective } from '../../../../../ca-core/entity-module/ca-notification-core/directive/ca-notification-mark/ca-notification-mark.directive';
import { MatIcon } from '@angular/material/icon';
import { FlIconModule } from '@monorepo/front-core-lib/fl-svg-icon';
import { MatTooltip } from '@angular/material/tooltip';
import { CaSyncObjectInfoComponent } from '../../../ca-folder-hierarchy-core/component/ca-sync-object-info/ca-sync-object-info.component';
import { FlUserModule } from '@monorepo/front-core-lib/fl-user';
import { FlStatusModule } from '@monorepo/front-core-lib/fl-status';
import { CaDetailRoutePipe } from '../../../../../ca-core/module/ca-core-pipe/ca-detail-route/ca-detail-route.pipe';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'ca-scenario-table',
  templateUrl: './ca-scenario-table.component.html',
  styleUrls: ['./ca-scenario-table.component.scss'],
  imports: [
    MatTable,
    MatColumnDef,
    MatHeaderCellDef,
    MatHeaderCell,
    MatCellDef,
    MatCell,
    RouterLink,
    CaNotificationMarkDirective,
    MatIcon,
    FlIconModule,
    MatTooltip,
    CaSyncObjectInfoComponent,
    FlUserModule,
    FlStatusModule,
    MatHeaderRowDef,
    MatHeaderRow,
    MatRowDef,
    MatRow,
    CaDetailRoutePipe,
    TranslatePipe,
  ],
})
export class CaScenarioTableComponent {
  @Input({ required: true }) datasource: FlDatasource<CaScenario>;

  @Input() columns: FlTableColumnStatic<CaScenario>[] = ['title', 'lastSync', 'status', 'createdBy'];

  // when true, the row become clickable and resourceSelected event is trigger
  @Input() rowSelectable: boolean = false;

  @Output() scenarioSelected: EventEmitter<CaScenario> = new EventEmitter();

  rowClicked(scenario: CaScenario): void {
    if (this.rowSelectable) {
      this.scenarioSelected.next(scenario);
    }
  }
}
