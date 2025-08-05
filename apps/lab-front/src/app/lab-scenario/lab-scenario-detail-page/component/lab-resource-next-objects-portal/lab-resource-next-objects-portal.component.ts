import { Component, inject } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { FlEntityPaginatedDatasource, FlTableColumnStatic } from '@monorepo/front-core-lib/fl-core';
import { FlInfiniteScrollModule } from '@monorepo/front-core-lib/fl-infinite-scroll';
import { FL_PORTAL_DATA, FlPortalModule } from '@monorepo/front-core-lib/fl-portal';
import { FlIconModule } from '@monorepo/front-core-lib/fl-svg-icon';
import { FlTextIconModule } from '@monorepo/front-core-lib/fl-text-icon';
import {
  LiNote,
  LiNoteDatasource,
  LiNoteService,
  LiScenario,
  LiScenarioDatasource,
  LiScenarioService,
} from '@monorepo/lab-lib/li-core';
import { LiNoteTableComponent } from '@monorepo/lab-lib/li-note';
import { LiScenarioTableComponent } from '@monorepo/lab-lib/li-scenario';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'lab-resource-next-objects-portal',
  templateUrl: './lab-resource-next-objects-portal.component.html',
  styleUrl: './lab-resource-next-objects-portal.component.scss',
  imports: [
    FlPortalModule,
    FlTextIconModule,
    MatIcon,
    FlIconModule,
    FlInfiniteScrollModule,
    LiScenarioTableComponent,
    LiNoteTableComponent,
    TranslatePipe,
  ],
})
export class LabResourceNextObjectsPortalComponent {
  private scenarioService = inject(LiScenarioService);
  private noteService = inject(LiNoteService);

  scenarios: LiScenarioDatasource;
  scenarioColumns: FlTableColumnStatic<LiScenario>[] = ['title', 'status'];

  notes: LiNoteDatasource;
  noteColumns: FlTableColumnStatic<LiNote>[] = ['title', 'lastModification'];

  constructor() {
    const resourceId = inject(FL_PORTAL_DATA);

    this.scenarios = new FlEntityPaginatedDatasource(
      (page, pageSize) => this.scenarioService.getByInputResource(resourceId, page, pageSize),
      5
    );

    this.notes = new FlEntityPaginatedDatasource(
      (page, pageSize) => this.noteService.getByResource(resourceId, page, pageSize),
      5
    );
  }
}
