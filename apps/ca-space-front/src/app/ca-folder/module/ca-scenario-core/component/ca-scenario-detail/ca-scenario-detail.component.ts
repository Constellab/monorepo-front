import { Component, inject, input } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { switchMap } from 'rxjs';
import { FlSectionModule } from '../../../../../../../../../libs/front-core-lib/src/lib/fl-section';
import { CaLabCardComponent } from '../../../../../ca-core/entity-module/ca-lab-core/component/ca-lab-card/ca-lab-card.component';
import { CaRootFolderUserRoleObj } from '../../../../../ca-core/model/entities/folder/ca-folder-user.class';
import { CaHierarchyObjectTagDatasource } from '../../../../../ca-core/model/entities/folder/ca-hierarchy-object.class';
import { CaScenarioService } from '../../../../../ca-core/service-api/ca-scenario.service';
import { CaScenarioCardDetailComponent } from '../ca-scenario-card-detail/ca-scenario-card-detail.component';
import { CaScenarioTechnicalReportComponent } from '../ca-scenario-technical-report/ca-scenario-technical-report.component';

@Component({
  selector: 'ca-scenario-detail',
  imports: [
    FlSectionModule,
    CaScenarioCardDetailComponent,
    CaLabCardComponent,
    CaScenarioTechnicalReportComponent,
  ],
  templateUrl: './ca-scenario-detail.component.html',
  styleUrl: './ca-scenario-detail.component.scss',
})
export class CaScenarioDetailComponent {
  scenarioId = input.required<string>();
  userRole = input.required<CaRootFolderUserRoleObj>();
  tags = input<CaHierarchyObjectTagDatasource>();

  private scenarioService = inject(CaScenarioService);

  scenario$ = toObservable(this.scenarioId).pipe(switchMap((id) => this.scenarioService.getById(id)));
}
