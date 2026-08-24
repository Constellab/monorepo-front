import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FlCoreDirectiveModule } from '@monorepo/front-core-lib/fl-core-directive';
import { FlSectionModule } from '@monorepo/front-core-lib/fl-section';
import { map } from 'rxjs/operators';

import { CaHierarchyObjectDetailState } from '../../ca-folder-hierarchy-core/state/ca-hierarchy-object-detail.state';
import { CaScenarioDetailComponent } from '../../ca-scenario-core/component/ca-scenario-detail/ca-scenario-detail.component';

@Component({
  selector: 'ca-scenario-detail-page',
  templateUrl: './ca-scenario-detail-page.component.html',
  styleUrls: ['./ca-scenario-detail-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [FlSectionModule, FlCoreDirectiveModule, CaScenarioDetailComponent, AsyncPipe],
})
export class CaScenarioDetailPageComponent {
  private state = inject(CaHierarchyObjectDetailState);
  scenarioId$ = inject(ActivatedRoute).params.pipe(map((params) => params.id));
  userRole$ = this.state.getUserRole$();

  tags = this.state.getTags();
}
