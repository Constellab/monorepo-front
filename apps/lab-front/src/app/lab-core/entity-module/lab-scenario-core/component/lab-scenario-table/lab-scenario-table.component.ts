import { Component, EventEmitter, inject, Injector, Input, Output } from '@angular/core';
import { FlArrayObs, FlTableColumnStatic } from '@monorepo/front-core-lib/fl-core';
import { FlTag } from '@monorepo/front-core-lib/fl-tag';
import { LabScenario } from '../../../../model/entities/lab-scenario.entity';
import { ClHelpService } from '@monorepo/core-lib';
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
import { MatSortHeader } from '@angular/material/sort';
import { FlSearchModule } from '@monorepo/front-core-lib/fl-search';
import { RouterLink } from '@angular/router';
import { FlTextIconModule } from '@monorepo/front-core-lib/fl-text-icon';
import { MatIcon } from '@angular/material/icon';
import { FlIconModule } from '@monorepo/front-core-lib/fl-svg-icon';
import { FlStatusModule } from '@monorepo/front-core-lib/fl-status';
import { LabScenarioIconsComponent } from '../lab-scenario-icons/lab-scenario-icons.component';
import { FlUserModule } from '@monorepo/front-core-lib/fl-user';
import { LabTagListComponent } from '../../../lab-tag-core/component/lab-tag-list/lab-tag-list.component';
import { MatIconButton } from '@angular/material/button';
import { MatTooltip } from '@angular/material/tooltip';
import { TranslatePipe } from '@ngx-translate/core';
import { FlColorModule } from '@monorepo/front-core-lib/fl-color';
import { LabDetailRoutePipe } from '../../../../lab-core-pipe/lab-detail-route/lab-detail-route.pipe';
import { LabGetEntityTagsPipe } from '../../../lab-tag-core/pipe/lab-get-entity-tags.pipe';
import { LabScenarioActionEvent, LabScenarioActionMenu } from '../../model/lab-scenario-action-menu';
import { LabTagService } from '../../../../entity-service/lab-tag.service';

@Component({
  selector: 'lab-scenario-table',
  templateUrl: './lab-scenario-table.component.html',
  styleUrls: ['./lab-scenario-table.component.scss'],
  imports: [
    MatTable,
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

  private tagService = inject(LabTagService);
  private injector = inject(Injector);

  rowClicked(scenario: LabScenario): void {
    if (this.rowSelectable) {
      this.scenarioSelected.next(scenario);
    }
  }

  unlinkedScenario(scenario: LabScenario, event: MouseEvent): void {
    ClHelpService.stopEventPropagation(event);
    this.scenarioUnlink.next(scenario);
  }

  openActionMenu(scenario: LabScenario, event: MouseEvent): void {
    const scenarioActionMenu = new LabScenarioActionMenu(
      this.injector,
      scenario,
      this.tagService.getEntityTagsDatasource('SCENARIO', scenario.id)
    );

    scenarioActionMenu.openActionMenuInTable(event).subscribe((action) => this.onActionClosed(action));
  }

  private onActionClosed(event: LabScenarioActionEvent): void {
    if (event.action === 'archive' || event.action === 'unarchive') {
      this.datasource.updateItem(event.scenario);
    }
  }
}
