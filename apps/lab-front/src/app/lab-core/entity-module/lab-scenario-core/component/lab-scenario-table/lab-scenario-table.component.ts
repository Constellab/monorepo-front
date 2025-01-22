import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FlArrayObs, FlTableColumnStatic, FlTag } from '@monorepo/front-core-lib';
import { LabScenario } from '../../../../model/entities/lab-scenario.entity';
import { ClHelpService } from '@monorepo/core-lib';
import {
  MatTable,
  MatColumnDef,
  MatHeaderCellDef,
  MatHeaderCell,
  MatCellDef,
  MatCell,
  MatHeaderRowDef,
  MatHeaderRow,
  MatRowDef,
  MatRow,
} from '@angular/material/table';
import { MatSort, MatSortHeader } from '@angular/material/sort';
import { FlSearchModule } from '../../../../../../../../../libs/front-core-lib/src/lib/module/fl-search/fl-search.module';
import { RouterLink } from '@angular/router';
import { FlTextIconModule } from '../../../../../../../../../libs/front-core-lib/src/lib/module/fl-text-icon/fl-text-icon.module';
import { MatIcon } from '@angular/material/icon';
import { FlIconModule } from '../../../../../../../../../libs/front-core-lib/src/lib/module/fl-svg-icon/fl-icon.module';
import { FlStatusModule } from '../../../../../../../../../libs/front-core-lib/src/lib/module/fl-status/fl-status.module';
import { LabScenarioIconsComponent } from '../lab-scenario-icons/lab-scenario-icons.component';
import { FlUserModule } from '../../../../../../../../../libs/front-core-lib/src/lib/module/fl-user/fl-user.module';
import { LabTagListComponent } from '../../../lab-tag-core/component/lab-tag-list/lab-tag-list.component';
import { MatIconButton } from '@angular/material/button';
import { MatTooltip } from '@angular/material/tooltip';
import { TranslatePipe } from '@ngx-translate/core';
import { FlColorModule } from '../../../../../../../../../libs/front-core-lib/src/lib/module/fl-color/fl-color.module';
import { LabDetailRoutePipe } from '../../../../lab-core-pipe/lab-detail-route/lab-detail-route.pipe';
import { LabGetEntityTagsPipe } from '../../../lab-tag-core/pipe/lab-get-entity-tags.pipe';

@Component({
  selector: 'lab-scenario-table',
  templateUrl: './lab-scenario-table.component.html',
  styleUrls: ['./lab-scenario-table.component.scss'],
  imports: [
    MatTable,
    MatSort,
    FlSearchModule,
    MatColumnDef,
    MatHeaderCellDef,
    MatHeaderCell,
    MatSortHeader,
    MatCellDef,
    MatCell,
    RouterLink,
    FlTextIconModule,
    MatIcon,
    FlIconModule,
    FlStatusModule,
    LabScenarioIconsComponent,
    FlUserModule,
    LabTagListComponent,
    MatIconButton,
    MatTooltip,
    MatHeaderRowDef,
    MatHeaderRow,
    MatRowDef,
    MatRow,
    TranslatePipe,
    FlColorModule,
    LabDetailRoutePipe,
    LabGetEntityTagsPipe,
  ],
})
export class LabScenarioTableComponent {
  @Input() datasource: FlArrayObs<LabScenario>;

  @Input() columns: FlTableColumnStatic<LabScenario>[] = ['title', 'status', 'tags', 'lastModification'];

  @Input() rowSelectable: boolean = false;

  @Input() rowLinkTarget: '_self' | '_blank' = '_self';

  @Output() scenarioSelected: EventEmitter<LabScenario> = new EventEmitter();

  @Output() tagSelected: EventEmitter<FlTag> = new EventEmitter();

  @Output() scenarioUnlink: EventEmitter<LabScenario> = new EventEmitter();

  rowClicked(scenario: LabScenario): void {
    if (this.rowSelectable) {
      this.scenarioSelected.next(scenario);
    }
  }

  unlinkedScenario(scenario: LabScenario, event: MouseEvent): void {
    ClHelpService.stopEventPropagation(event);
    this.scenarioUnlink.next(scenario);
  }
}
