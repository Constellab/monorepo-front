import { Component, computed, EventEmitter, inject, input, Input, Output } from '@angular/core';
import { CaScenario } from '../../../../../ca-core/model/entities/folder/ca-scenario.class';
import { CaLabHelper } from '../../../../../ca-core/utils/ca-lab.helper';
import { FlCardModule } from '@monorepo/front-core-lib/fl-card';
import {
  CaHierarchyObjectIconComponent,
} from '../../../../../ca-core/entity-module/ca-hierarchy-object-core/component/ca-hierarchy-object-icon/ca-hierarchy-object-icon.component';
import { FlStatusModule } from '@monorepo/front-core-lib/fl-status';
import { CaScenarioInfoComponent } from '../ca-scenario-info/ca-scenario-info.component';
import { MatAnchor, MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { TranslatePipe } from '@ngx-translate/core';
import {
  CaHierarchyObjectDetailState,
} from '../../../ca-folder-hierarchy-core/state/ca-hierarchy-object-detail.state';
import { CaScenarioActionMenu } from '../../ca-scenario-action-menu';
import { FlDialogService } from '@monorepo/front-core-lib/fl-dialog';
import { FlMenuDynamicService } from '@monorepo/front-core-lib/fl-menu-dynamic';

/**
 * Detail card of the scenario used in the scenario page
 */
@Component({
  selector: 'ca-scenario-card-detail',
  templateUrl: './ca-scenario-card-detail.component.html',
  styleUrls: ['./ca-scenario-card-detail.component.scss'],
  imports: [
    FlCardModule,
    CaHierarchyObjectIconComponent,
    FlStatusModule,
    CaScenarioInfoComponent,
    MatAnchor,
    MatIcon,
    TranslatePipe,
    MatIconButton,
  ],
})
export class CaScenarioCardDetailComponent {
  scenario = input.required<CaScenario>();

  @Input() showCardHeader: boolean = true;

  @Output() update: EventEmitter<CaScenario> = new EventEmitter<CaScenario>();

  scenarioRoute = computed(() => {
    if (this.scenario().lab.isRunning()) {
      return CaLabHelper.getScenarioUrl(this.scenario().lab.frontUrl, this.scenario().id);
    }
    return null;
  });

  tags = inject(CaHierarchyObjectDetailState).getTags();

  private dialogService = inject(FlDialogService);
  private menuDynamicService = inject(FlMenuDynamicService);

  openActionMenu(event: MouseEvent): void {
    const scenarioActionMenu = new CaScenarioActionMenu(
      this.dialogService,
      this.menuDynamicService,
      this.scenario().id,
      this.tags
    );

    scenarioActionMenu.openActionMenu(event);
  }
}
