import { ChangeDetectionStrategy,Component, computed, inject, Injector, input } from '@angular/core';
import { MatAnchor, MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FlCardModule } from '@monorepo/front-core-lib/fl-card';
import { FlStatusModule } from '@monorepo/front-core-lib/fl-status';
import { FlIconModule } from '@monorepo/front-core-lib/fl-svg-icon';
import { TranslatePipe } from '@ngx-translate/core';

import { CaHierarchyObjectIconComponent } from '../../../../../ca-core/entity-module/ca-hierarchy-object-core/component/ca-hierarchy-object-icon/ca-hierarchy-object-icon.component';
import { CaRootFolderUserRoleObj } from '../../../../../ca-core/model/entities/folder/ca-folder-user.class';
import { CaHierarchyObjectTagDatasource } from '../../../../../ca-core/model/entities/folder/ca-hierarchy-object.class';
import { CaScenario } from '../../../../../ca-core/model/entities/folder/ca-scenario.class';
import { CaLabHelper } from '../../../../../ca-core/utils/ca-lab.helper';
import { CaHierarchyObjectEventState } from '../../../ca-folder-hierarchy-core/state/ca-hierarchy-object-event.state';
import { CaScenarioActionEvent, CaScenarioActionMenu } from '../../ca-scenario-action-menu';
import { CaScenarioInfoComponent } from '../ca-scenario-info/ca-scenario-info.component';

/**
 * Detail card of the scenario used in the scenario page
 */
@Component({
  selector: 'ca-scenario-card-detail',
  templateUrl: './ca-scenario-card-detail.component.html',
  styleUrls: ['./ca-scenario-card-detail.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    FlCardModule,
    CaHierarchyObjectIconComponent,
    FlStatusModule,
    CaScenarioInfoComponent,
    MatAnchor,
    TranslatePipe,
    MatButtonModule,
    FlIconModule,
    MatIconModule,
  ],
})
export class CaScenarioCardDetailComponent {
  scenario = input.required<CaScenario>();
  userRole = input.required<CaRootFolderUserRoleObj>();
  tags = input<CaHierarchyObjectTagDatasource>();

  private eventState = inject(CaHierarchyObjectEventState, { optional: true });

  scenarioRoute = computed(() => {
    if (this.scenario().lab.isRunning()) {
      return CaLabHelper.getScenarioUrl(this.scenario().lab.frontUrl, this.scenario().id);
    }
    return null;
  });

  private injector = inject(Injector);

  openActionMenu(event: MouseEvent): void {
    const scenarioActionMenu = new CaScenarioActionMenu(this.injector, this.scenario().id, this.userRole(), {
      tags: this.tags(),
    });

    scenarioActionMenu.openActionMenu(event, false).subscribe((action) => this.onScenarioAction(action));
  }

  private onScenarioAction(event: CaScenarioActionEvent): void {
    if (this.eventState) {
      this.eventState.emitHierarchyObjectEvent(event);
    }
  }
}
