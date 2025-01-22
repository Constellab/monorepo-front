import { Component, computed, EventEmitter, input, Input, Output } from '@angular/core';
import { CaScenario } from '../../../../../ca-core/model/entities/folder/ca-scenario.class';
import { CaLabHelper } from '../../../../../ca-core/utils/ca-lab.helper';
import { FlCardModule } from '../../../../../../../../../libs/front-core-lib/src/lib/module/fl-card/fl-card.module';
import { CaHierarchyObjectIconComponent } from '../../../../../ca-core/entity-module/ca-hierarchy-object-core/component/ca-hierarchy-object-icon/ca-hierarchy-object-icon.component';
import { FlStatusModule } from '../../../../../../../../../libs/front-core-lib/src/lib/module/fl-status/fl-status.module';
import { CaScenarioInfoComponent } from '../ca-scenario-info/ca-scenario-info.component';
import { MatAnchor } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { TranslatePipe } from '@ngx-translate/core';

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
}
