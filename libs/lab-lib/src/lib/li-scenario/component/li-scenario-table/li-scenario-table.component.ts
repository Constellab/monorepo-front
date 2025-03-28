import { ClHelpService } from '@monorepo/core-lib';
import { Component, EventEmitter, Injector, Input, Output, inject } from '@angular/core';
import { FlArrayObs, FlTableColumnStatic } from '@monorepo/front-core-lib/fl-core';
import { FlColorModule } from '@monorepo/front-core-lib/fl-color';
import { FlIconModule } from '@monorepo/front-core-lib/fl-svg-icon';
import { FlSearchModule } from '@monorepo/front-core-lib/fl-search';
import { FlStatusModule } from '@monorepo/front-core-lib/fl-status';
import { FlTag } from '@monorepo/front-core-lib/fl-tag';
import { FlTextIconModule } from '@monorepo/front-core-lib/fl-text-icon';
import { FlUserModule } from '@monorepo/front-core-lib/fl-user';
import { LiDetailRoutePipe, LiScenario, LiTagService } from '@monorepo/lab-lib/li-core';
import { LiScenarioActionEvent, LiScenarioActionMenu } from '../../model/li-scenario-action-menu';
import { LiScenarioIconsComponent } from '../li-scenario-icons/li-scenario-icons.component';
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
import { MatIcon } from '@angular/material/icon';
import { MatIconButton } from '@angular/material/button';
import { MatSortHeader } from '@angular/material/sort';
import { MatTooltip } from '@angular/material/tooltip';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { LiGetEntityTagsPipe, LiTagListComponent } from '@monorepo/lab-lib/li-tag';

@Component({
  selector: 'li-scenario-table',
  templateUrl: './li-scenario-table.component.html',
  styleUrls: ['./li-scenario-table.component.scss'],
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
    LiScenarioIconsComponent,
    FlUserModule,
    LiTagListComponent,
    MatIconButton,
    MatTooltip,
    MatHeaderRowDef,
    MatHeaderRow,
    MatRowDef,
    MatRow,
    TranslatePipe,
    FlColorModule,
    LiDetailRoutePipe,
    LiGetEntityTagsPipe,
  ],
})
export class LiScenarioTableComponent {
  @Input() datasource: FlArrayObs<LiScenario>;

  @Input() columns: FlTableColumnStatic<LiScenario>[] = ['title', 'status', 'tags', 'lastModification'];

  @Input() rowSelectable: boolean = false;

  @Input() rowLinkTarget: '_self' | '_blank' = '_self';

  @Output() scenarioSelected: EventEmitter<LiScenario> = new EventEmitter();

  @Output() tagSelected: EventEmitter<FlTag> = new EventEmitter();

  @Output() scenarioUnlink: EventEmitter<LiScenario> = new EventEmitter();

  private tagService = inject(LiTagService);
  private injector = inject(Injector);

  rowClicked(scenario: LiScenario): void {
    if (this.rowSelectable) {
      this.scenarioSelected.next(scenario);
    }
  }

  unlinkedScenario(scenario: LiScenario, event: MouseEvent): void {
    ClHelpService.stopEventPropagation(event);
    this.scenarioUnlink.next(scenario);
  }

  openActionMenu(scenario: LiScenario, event: MouseEvent): void {
    const scenarioActionMenu = new LiScenarioActionMenu(
      this.injector,
      scenario,
      this.tagService.getEntityTagsDatasource('SCENARIO', scenario.id)
    );

    scenarioActionMenu.openActionMenuInTable(event).subscribe((action) => this.onActionClosed(action));
  }

  private onActionClosed(event: LiScenarioActionEvent): void {
    if (event.action === 'archive' || event.action === 'unarchive') {
      this.datasource.updateItem(event.scenario);
    }
  }
}
